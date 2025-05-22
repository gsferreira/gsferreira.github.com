---
layout: post
tags: post
date: 
title: Implementing a C# Repository with Selective Caching and a MongoDB Search Index
description: 
featured_image: /images/archive/highlight/
---
We developers love to talk about performance – almost as much as we hate debugging stale cache issues. In this post, I'm going to walk through a small, conceptual C# project that showcases the Repository Pattern combined with selective caching, cache invalidation (everyone's favorite problem), and a MongoDB-powered search index. We'll build this step by step in an opinionated way, using idiomatic C# (async/await, dependency injection, etc.), and we'll even make it runnable with Docker Compose.

## The Repository Pattern

The Repository Pattern is a way to abstract data access behind an interface. Instead of adding database calls everywhere, you centralize them in a repository class. This makes swapping out the ORM or adding caching easier.

For our demo, let's say we have a simple domain entity called Item (imagine it could be products, blog posts, whatever). We want a repository that can get items (by ID or via a search), add new items, and update items. Some of these operations will go straight to the database (no caching, no indexing), some will use an in-memory cache, and some will update a MongoDB collection that acts as a search index. We'll use MongoDB for data storage and as our search index (just in separate collections for clarity). 

To keep things simple, our "database" will be MongoDB (running in a container), but you can imagine it could be any data source. We'll use .NET’s built-in DI (dependency injection) container to wire things up, along with IMemoryCache for caching. Everything will be packaged so you can run it with Docker Compose. Before we get into caching and indexing, let's sketch out the basic repository interface and a baseline implementation with no caching at all:

```csharp
public class Item 
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public interface IItemRepository 
{
    Task<Item?> GetItemAsync(int id);
    Task<List<Item>> GetAllItemsAsync();
    Task<List<Item>> SearchItemsAsync(string name);
    Task AddItemAsync(Item item);
    Task UpdateItemAsync(Item item);
}
```

This interface covers the operations we need. Now, let's start with an implementation that hits the database directly.

## Direct Database Calls (No Cache, No Index)

In the simplest case, our repository methods just call the database (MongoDB) directly. This is the "do nothing special" approach — easy to implement and always returns fresh data. The downside? If the database calls are slow or frequent, your performance will suffer. But simplicity has its charm. Let's look at how our repository might be implemented initially:

```csharp
public class ItemRepository : IItemRepository
{
    private readonly IMongoCollection<Item> _itemsCollection;

    public ItemRepository(IMongoClient mongoClient)
 {
        var database = mongoClient.GetDatabase("DemoDb");
        _itemsCollection = database.GetCollection<Item>("Items");
 }

    public async Task<Item?> GetItemAsync(int id)
 {
        return await _itemsCollection
 .Find(item => item.Id == id)
 .FirstOrDefaultAsync();
 }

    public async Task<List<Item>> GetAllItemsAsync()
 {
        return await _itemsCollection
 .Find(FilterDefinition<Item>.Empty)
 .ToListAsync();
 }

    public async Task AddItemAsync(Item item)
 {
        await _itemsCollection.InsertOneAsync(item);
 }

    public async Task UpdateItemAsync(Item item)
 {
        await _itemsCollection.ReplaceOneAsync(i => i.Id == item.Id, item);
 }

    public async Task<List<Item>> SearchItemsAsync(string name)
 {
        var filter = Builders<Item>.Filter.Regex(x => x.Name, new BsonRegularExpression(name, "i"));
        return await _itemsCollection.Find(filter).ToListAsync();
 }
}
```

Note: We're using the MongoDB .NET driver to fetch data. Builders<Item>.Filter.Regex(...) is constructing a case-insensitive regex filter on the Name field. In a real scenario, this kind of search can be slow on large data sets without an index – which is exactly why we'll introduce a separate search index soon.

Right now, GetItemAsync and GetAllItemsAsync do the obvious thing: hit the database. Our SearchItemsAsync is also just querying the main collection (probably not super efficient, but it works). This is our baseline. Trade-off (No Cache): It's simple and always up-to-date with the database. However, if GetItemAsync(42) is called 1000 times, that's 1000 database hits for the same data.

## Adding an In-Memory Cache (Cache Aside)

Caching to the rescue! The idea of caching here is to avoid repeated database work for the same data. A common pattern is Cache-Aside (or lazy caching): your code checks the cache first; if the data is there, great – return it. If not, fetch from DB, then store it in cache for next time. We'll use IMemoryCache for this, which is a thread-safe in-memory cache provided by .NET. By default, an IMemoryCache is a simple in-process cache (not distributed). Let's modify our repository to cache individual items when fetched by ID. We won't cache the GetAllItemsAsync in this demo (imagine that returning a large list and being trickier to keep updated – we'll keep it always fresh for simplicity). We also won't worry about clearing the cache just yet – this scenario is caching without any explicit invalidation. First, we update the repository constructor to accept an IMemoryCache through DI and hold on to it:

```csharp
public class ItemRepository : IItemRepository
{
    private readonly IMongoCollection<Item> _itemsCollection;
    private readonly IMemoryCache _cache;

    public ItemRepository(IMongoClient mongoClient, IMemoryCache cache)
 {
        var database = mongoClient.GetDatabase("DemoDb");
        _itemsCollection = database.GetCollection<Item>("Items");
        _cache = cache;
 }

 //the rest of the methods
}
```

Now, let's implement GetItemAsync with caching logic:

```csharp
public async Task<Item?> GetItemAsync(int id)
{
    string cacheKey = $"Item:{id}";
    if (_cache.TryGetValue(cacheKey, out Item cachedItem))
 {
        return cachedItem;
 }

    var item = await _itemsCollection.Find(i => i.Id == id).FirstOrDefaultAsync();
    if (item != null)
 {
        _cache.Set(cacheKey, item);
 }
    return item;
}
```

What’s happening here is straightforward: we compose a cache key (e.g., "Item:42" for item ID 42). We ask the cache if it has this item; if yes, we avoid a DB call. If not, we query Mongo, then stash the result in the cache. The next time someone requests the same item, we'll serve it from memory.

At this point, we haven't changed AddItemAsync or UpdateItemAsync at all. They still just write to the database. This means our cache has no knowledge when data changes. In other words, we've created a potential cache inconsistency problem: if an item gets updated in the database, our cache might still hold the old value and happily serve stale data. Let's fix this problem.

## Caching with Invalidation

Time to fix our stale data problem. The classic saying goes: "There are only two hard things in Computer Science: cache invalidation, naming things, and off-by-one errors." We can't avoid the challenge of cache invalidation if we want correct data.

Our strategy will be simple: whenever we change data (through AddItemAsync, UpdateItemAsync, or a hypothetical DeleteItemAsync), we'll remove the corresponding entry from the cache. This way, subsequent reads will fetch fresh data from the DB (and then cache it again). This is a straightforward approach to maintain consistency. In more sophisticated setups, you might update the cache entry with the new value instead of just removing it, but removal (a.k.a. cache eviction) is simpler and less error-prone for our needs. Let's update our repository methods to invalidate relevant cache entries on writes:

```csharp
public async Task AddItemAsync(Item item)
{
    await _itemsCollection.InsertOneAsync(item);
}

public async Task UpdateItemAsync(Item item)
{
    await _itemsCollection.ReplaceOneAsync(i => i.Id == item.Id, item);
    string cacheKey = $"Item:{item.Id}";
    _cache.Remove(cacheKey);
}
```

We added one important line in UpdateItemAsync: _cache.Remove(cacheKey). Now, using the earlier example, after updating item 42, the cache for "Item:42" is evicted. So the next GetItemAsync(42) will be forced to hit the database and retrieve the latest data (which will then be cached anew). Problem solved! (Well, solved in a single-instance scenario. If you have multiple instances of your application, you'd need a distributed cache or some way to broadcast invalidation across instances — but that's beyond our demo's scope.)

if we had a GetAllItemsAsync cache (say we cached the list of all items), an AddItemAsync or UpdateItemAsync should also invalidate that cached list. In our demo, we chose not to cache GetAllItemsAsync at all, partly to avoid that complexity. In real life, caching broad queries (like "all items" or complex filtered lists) can be useful for read-heavy scenarios, but you have to carefully invalidate or update those caches whenever any underlying item changes. Otherwise, users might not see new items or might see outdated lists. This is a classic trade-off: more caching = more places to update when data changes. So far so good: we have a repository that uses caching where it makes sense (item lookups by ID), and keeps the cache in sync when updates occur. Reads are fast (cache hits are in-memory), and writes incur a slight overhead to clear cache entries, but that overhead is usually negligible compared to, say, an actual DB write. However, our search function (SearchItemsAsync) is still doing a brute-force scan on the MongoDB collection. If Items is large, searching by name might be slow. We could add caching for search results too, but caching every query permutation is hard (and not memory-friendly). Instead, let's approach the search problem from another angle: maintain a search index.

## Maintaining a MongoDB Search Index

For better search performance (and to simulate a common real-world pattern), we're going to maintain a separate collection in MongoDB as a search index. This collection will store just the information needed to search items by name. In our case, that could be as simple as storing each item's Id and Name (and perhaps any other fields you'd want to search on, like tags or categories). By keeping this index, we can perform search queries on a lean collection that could be optimized (for example, we could add a text index on the Name field in Mongo for efficient text search). Here's how we'll approach it:
- Create a MongoDB collection (say "ItemSearchIndex") with documents containing { Id, Name } for each item.
- Whenever an item is added or updated in the main Items collection, upsert the corresponding document in the search index collection.
- When an item is deleted (not shown in code, but we'd remove it from the index too).
- Implement SearchItemsAsync(name) to query the search index collection (which is much smaller and can have an index on Name), get matching Ids, then fetch those items from the main collection (or possibly even store the whole item in the index for quicker results – but duplicating entire data in the index can be heavy, so we'll just store minimal fields).

Let's add a _searchCollection to our repository and update the constructor:

```csharp
public class ItemRepository : IItemRepository
{
    private readonly IMongoCollection<Item> _itemsCollection;
    private readonly IMongoCollection<SearchEntry> _searchCollection;
    private readonly IMemoryCache _cache;

    public ItemRepository(IMongoClient mongoClient, IMemoryCache cache)
 {
        var database = mongoClient.GetDatabase("DemoDb");
        _itemsCollection = database.GetCollection<Item>("Items");
        _searchCollection = database.GetCollection<SearchEntry>("ItemSearchIndex");
        _cache = cache;
 }
 // ... 
}
```

We assume a class SearchEntry defined as:

```csharp
public class SearchEntry
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
```

This SearchEntry is just a lightweight version of an item for indexing purposes. Now, modify AddItemAsync and UpdateItemAsync to keep the search index in sync:

```csharp
public async Task AddItemAsync(Item item)
{
    await _itemsCollection.InsertOneAsync(item);
    var entry = new SearchEntry { Id = item.Id, Name = item.Name };
    await _searchCollection.InsertOneAsync(entry);
}

public async Task UpdateItemAsync(Item item)
{
    await _itemsCollection.ReplaceOneAsync(i => i.Id == item.Id, item);
    var entry = new SearchEntry { Id = item.Id, Name = item.Name };
    await _searchCollection.ReplaceOneAsync(
        filter: Builders<SearchEntry>.Filter.Eq(e => e.Id, item.Id),
        replacement: entry,
        options: new ReplaceOptions { IsUpsert = true }
 );
    _cache.Remove($"Item:{item.Id}");
}
```

Notice we've added an upsert (ReplaceOneAsync with IsUpsert = true) for the search index update. That covers both cases: if the search entry exists, replace it; if not (say, we somehow call update before an entry was created, or an entry was missing), insert a new one. Finally, let's implement SearchItemsAsync to use the _searchCollection:

```csharp
public async Task<List<Item>> SearchItemsAsync(string name)
{
    var filter = Builders<SearchEntry>.Filter.Regex(e => e.Name, new BsonRegularExpression(name, "i"));
    var matchedEntries = await _searchCollection.Find(filter).ToListAsync();
    
    var results = new List<Item>();
    foreach (var entry in matchedEntries)
 {
        var item = await _itemsCollection.Find(i => i.Id == entry.Id).FirstOrDefaultAsync();
        if (item != null)
            results.Add(item);
 }
    return results;
}
```

What did we do? Instead of searching the large Items collection, we search the ItemSearchIndex collection which contains just Id and Name. The filter uses a case-insensitive regex on the Name. This is relatively efficient especially if we add a proper index on the Name field in that collection (which we could do in MongoDB with a text index or a standard index if we were doing prefix searches, etc.).

Once we get the matching SearchEntry docs, we loop through them and fetch the full Item from the main collection by Id. This is a second roundtrip to the DB per result, but for demonstration it's fine. In a real application with many results, you might instead project all needed fields into the search index to avoid that second fetch, or use a single query to fetch all items by IDs (e.g., an $in query to Mongo with all matched IDs, or use the cache to get items if they're already cached). There are many ways to optimize, but we'll keep it simple and clear. 

Now, whenever we add or update an item, our search index stays up-to-date. If we run SearchItemsAsync("Widget"), we’ll get results based on the latest data. If an item’s name changes from "Widget" to "Gadget", our update logic ensures the search index now has "Gadget", so searching "Widget" won’t return it anymore.

Trade-off (Separate Index): We've introduced duplication of data. Data for each item now lives in two places: the main collection and the search index collection. This speeds up searches (and potentially allows scaling the search index separately or using specialized indexing features), but we have to be very diligent in updating both places. A bug or crash that updates one and not the other could make search results inaccurate. In larger systems, it's common to handle this via events or background processing (to decouple the main write from the index update), but that introduces eventual consistency (search might temporarily be out-of-sync) and more complexity. Here we did it inline for simplicity, but that means our write operations now take a bit longer (they hit two collections). As always, it's a balancing act.

## Running the Demo with Docker Compose

Let's talk about running this thing. We have a dependency on MongoDB, so the easiest way to try this out is using Docker Compose to spin up both our .NET app and a MongoDB instance. Below is a simplified docker-compose.yml snippet for our setup:

```yaml
services:
  mongo:
    image: mongo:5.0
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  app:
    build: .
    depends_on:
      - mongo
    environment:
      - MONGO_CONN=mongodb://mongo:27017

volumes:
  mongo_data:
```

and this is our dockerfile

```yaml
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ./src/CachingDemo.csproj ./src/
RUN dotnet restore ./src/CachingDemo.csproj

COPY ./src/ ./src/
RUN dotnet publish ./src/CachingDemo.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/runtime:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish ./

ENTRYPOINT ["dotnet", "CachingDemo.dll"]
```

## Conclusion

We've built a mini demo with a repository that:
- Uses caching selectively for frequently-accessed data,
- Invalidates the cache on updates to avoid serving stale info,
- Maintains a simple search index in MongoDB to speed up queries by name.

The end result is a bit more complex than the initial no-frills repository, but it performs better under certain conditions. This is the essence of engineering trade-offs: you accept some complexity to gain performance or scalability. The key is to ensure the gain is worth the pain.

My opinionated take: Start with the simplest thing that could possibly work (often, direct DB calls). Measure your application's performance. If (and only if) you identify a bottleneck – e.g., a particular query is too slow or your database is getting hammered with repeated identical reads – then consider adding a cache or index for that specific case. Keep the implementation as simple as possible. For example, if you can get away with a 5-minute expiration on a cache instead of wiring up elaborate invalidation logic, and that meets your consistency requirements, do that. If your built-in database can handle text search (like MongoDB's text indexes or SQL Server Full-Text Search), evaluate that first before maintaining a separate search system. In other words, don't sprinkle caches and indexes everywhere by default. It's a recipe for headaches if you don't absolutely need them. Nothing is worse than debugging an issue and realizing the user is seeing outdated data because of an overly aggressive cache that someone forgot to clear. That said, knowing how to implement these patterns is invaluable for the times when you do need them. Remember: simplicity is a feature. As a wise developer (maybe with a slight caffeine addiction) once said, "Caching and indexing can save your app... or make you wish you never added them in the first place." The difference lies in how thoughtfully you apply them. Happy coding, and may your caches always be fresh!