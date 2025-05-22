---
layout: post
tags: post
date:
title: Building a C# Repository with Selective Caching and MongoDB Search Index
description:
featured_image: /images/archive/highlight/
---

Developers love talking about performance. We also love debugging stale cache issues at 2 AM.

This post walks through a C# project that combines the Repository Pattern with selective caching, cache invalidation (everyone's favorite problem), and a MongoDB-powered search index. We'll build it step by step in an opinionated way, using C# and make it runnable with Docker Compose.

## The Repository Pattern

The Repository Pattern abstracts data access behind an interface. Instead of scattering database calls throughout your code, you centralize them in repository classes. This makes swapping ORMs or adding caching much easier.

Our demo uses a simple `Item` entity. We want a repository that can get items by ID, search items, add new items, and update existing ones. Some operations will hit the database directly, others will use in-memory cache, and some will update a MongoDB search index.

We'll use MongoDB (running in a container) for data storage and as our search index (just in separate collections for clarity).
We'll use .NET's built-in DI (dependency injection) container to wire things up, along with IMemoryCache for caching. Everything will be packaged so you can run it with Docker Compose.

### A Note on Separation of Concerns

Our repository will handle data access, caching, and search index maintenance all in one class. This works for a demo, but violates the Single Responsibility Principle. In production, consider using the Decorator pattern to separate these concerns:

```csharp
// Clean data access
public class ItemRepository : IItemRepository { /* MongoDB operations only */ }

// Caching decorator
public class CachedItemRepository : IItemRepository 
{
    private readonly IItemRepository _inner;
    private readonly IMemoryCache _cache;
    // Wraps the base repository with caching logic
}

// Search handled separately
public class ItemSearchService 
{
    // Dedicated search functionality
}
```

This approach makes each component easier to test, modify, and reason about independently. For our demo, we'll keep everything in one class for simplicity.

Here's our basic interface:

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

This interface covers our basic CRUD operations plus search. Let's start with a simple implementation that hits the database directly.

## Direct Database Calls (No Cache, No Index)

The simplest approach hits MongoDB directly for every operation. Easy to implement, always returns fresh data, but potentially slow if you're making frequent identical requests.
But simplicity has its charm. Let's look at how our repository might be implemented initially:

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

We're using the MongoDB .NET driver with `Builders<Item>.Filter.Regex()` for case-insensitive name searches. This works but can be slow on large datasets without proper indexing – which is exactly why we'll introduce a separate search index soon.

The trade-off here is simplicity versus performance. Call `GetItemAsync(42)` a thousand times and you'll make a thousand database trips for the same data.

## Adding In-Memory Cache (Cache-Aside Pattern)

Caching to the rescue! Let's add caching to avoid repeated database work. We'll use the Cache-Aside pattern: check cache first, if miss then fetch from database and store in cache.

We'll use .NET's `IMemoryCache` - a thread-safe, in-process cache. We'll cache individual items when fetched by ID but keep `GetAllItemsAsync` uncached for simplicity. We also won't worry about clearing the cache just yet – this scenario is caching without any explicit invalidation.

Update the constructor to accept `IMemoryCache` through dependency injection:

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

Now implement `GetItemAsync` with caching logic:

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

What's happening here is straightforward: we compose a cache key (e.g., "Item:42" for item ID 42). We ask the cache if it has this item; if yes, we avoid a DB call. If not, we query Mongo, then stash the result in the cache. The next time someone requests the same item, we'll serve it from memory.

But we've created a problem: our cache doesn't know when data changes. If someone updates an item in the database, our cache still holds the old value.

Time to fix our stale data problem. The classic saying goes: "There are only two hard things in Computer Science: cache invalidation, naming things, and off-by-one errors." We can't avoid the challenge of cache invalidation if we want correct data.

## Cache Invalidation

Cache invalidation is notoriously difficult. Our strategy is simple: when we change data through `AddItemAsync` or `UpdateItemAsync`, we remove the corresponding cache entry. This forces subsequent reads to fetch fresh data from the database.

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

We added one important line in `UpdateItemAsync`: `_cache.Remove(cacheKey)`.

After updating item 42, we evict "Item:42" from the cache. The next `GetItemAsync(42)` will hit the database and cache the fresh data.

Problem solved! (Well, solved in a single-instance scenario. If you have multiple instances of your application, you'd need a distributed cache or some way to broadcast invalidation across instances — but that's beyond our demo's scope.)

If we cached `GetAllItemsAsync` results (say we cached the list of all items), we'd also need to invalidate that cache entry whenever any item changes. This is why we kept it simple and didn't cache broad queries.

In real life, caching broad queries (like "all items" or complex filtered lists) can be useful for read-heavy scenarios, but you have to carefully invalidate or update those caches whenever any underlying item changes.
Otherwise, users might not see new items or might see outdated lists. This is a classic trade-off: more caching = more places to update when data changes.

So far so good: we have a repository that uses caching where it makes sense (item lookups by ID), and keeps the cache in sync when updates occur. Reads are fast (cache hits are in-memory), and writes incur a slight overhead to clear cache entries, but that overhead is usually negligible compared to, say, an actual DB write. However, our search function (SearchItemsAsync) is still doing a brute-force scan on the MongoDB collection. If Items is large, searching by name might be slow. We could add caching for search results too, but caching every query permutation is hard (and not memory-friendly). Instead, let's approach the search problem from another angle: maintain a search index.

## MongoDB Search Index

Our current search function does regex scans on the entire Items collection. This works for small datasets but becomes slow with thousands of items.

For better search performance (and to simulate a common real-world pattern), we're going to maintain a separate collection in MongoDB as a search index. This collection will store just the information needed to search items by name. In our case, that could be as simple as storing each item's Id and Name (and perhaps any other fields you'd want to search on, like tags or categories). By keeping this index, we can perform search queries on a lean collection that could be optimized (for example, we could add a text index on the Name field in Mongo for efficient text search). Here's how we'll approach it:
- Create a MongoDB collection (say "ItemSearchIndex") with documents containing `{ Id, Name }` for each item.
- Whenever an item is added or updated in the main Items collection, upsert the corresponding document in the search index collection.
- When an item is deleted (not shown in code, but we'd remove it from the index too).
- Implement SearchItemsAsync(name) to query the search index collection (which is much smaller and can have an index on Name), get matching Ids, then fetch those items from the main collection (or possibly even store the whole item in the index for quicker results – but duplicating entire data in the index can be heavy, so we'll just store minimal fields).

First, define the search entry class:

```csharp
public class SearchEntry
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
```

Add the search collection to our repository:

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
}
```

Update our write methods to maintain both collections:

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

We use `ReplaceOneAsync` with `IsUpsert = true` for the search index. This handles both updates (if the entry exists) and inserts (if it doesn't).

### Transaction Handling Considerations

Our current implementation has a potential data consistency problem. Look at this code:

```csharp
public async Task UpdateItemAsync(Item item)
{
    await _itemsCollection.ReplaceOneAsync(i => i.Id == item.Id, item);  // Step 1
    await _searchCollection.ReplaceOneAsync(/*...*/);                    // Step 2
    _cache.Remove($"Item:{item.Id}");                                    // Step 3
}
```

What happens if Step 2 fails? You end up with the main collection updated but the search index unchanged. Users searching for the item by its new name won't find it, but direct ID lookups will return the updated data.

You have several options, each with trade-offs:

**MongoDB Transactions**: Wrap both database operations in a transaction. Ensures consistency but requires MongoDB replica set and adds complexity.

**Event-Driven Updates**: Update the main collection, then publish an event for search index updates. This provides eventual consistency and better fault tolerance, but introduces temporary inconsistency and requires event infrastructure.

**Compensating Actions**: If the search index update fails, attempt to revert the main collection change. Simple but can lead to complex error handling.

**Accept Eventual Consistency**: Let the search index be temporarily out-of-sync and have a background process reconcile differences. This is often the most practical approach for non-critical search functionality.

The right choice depends on your consistency requirements, infrastructure, and how critical search accuracy is to your application. For our demo, we'll accept the risk of inconsistency to keep things simple.

Now implement search using the index:

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

Instead of searching the large Items collection, we search the smaller ItemSearchIndex collection (which contains just Id and Name). After getting matching IDs, we fetch the full items from the main collection. This is relatively efficient especially if we add a proper index on the Name field in that collection (which we could do in MongoDB with a text index or a standard index if we were doing prefix searches, etc.).

Once we get the matching SearchEntry docs, we loop through them and fetch the full Item from the main collection by Id. This is a second roundtrip to the DB per result, but for demonstration it's fine. In a real application with many results, you might instead project all needed fields into the search index to avoid that second fetch, or use a single query to fetch all items by IDs (e.g., an $in query to Mongo with all matched IDs, or use the cache to get items if they're already cached). There are many ways to optimize, but we'll keep it simple and clear.

### Watch Out for N+1 Queries

Our search implementation has a classic performance trap:

```csharp
foreach (var entry in matchedEntries)
{
    var item = await _itemsCollection.Find(i => i.Id == entry.Id).FirstOrDefaultAsync();
    // This creates one database call per search result
}
```

If your search returns 100 items, that's 101 database calls (1 search + 100 individual fetches). In production, batch these calls using MongoDB's `$in` operator to fetch all items in a single query, or store enough data in your search index to avoid the second fetch entirely.

Now, whenever we add or update an item, our search index stays up-to-date. If we run SearchItemsAsync("Widget"), we'll get results based on the latest data. If an item's name changes from "Widget" to "Gadget", our update logic ensures the search index now has "Gadget", so searching "Widget" won't return it anymore.

The trade-off: we now have data duplication. Data for each item now lives in two places: the main collection and the search index collection. This speeds up searches (and potentially allows scaling the search index separately or using specialized indexing features), but we have to be very diligent in updating both places. A bug or crash that updates one and not the other could make search results inaccurate. In larger systems, it's common to handle this via events or background processing (to decouple the main write from the index update), but that introduces eventual consistency (search might temporarily be out-of-sync) and more complexity. Here we did it inline for simplicity, but that means our write operations now take a bit longer (they hit two collections). As always, it's a balancing act.

## Running it with Docker Compose

Here's a `docker-compose.yml` to run everything:

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

And the Dockerfile:

```dockerfile
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

## What We Built

Our repository now handles:

* Selective caching for frequently-accessed data
* Cache invalidation to prevent stale data
* A separate search index for fast queries

Each addition brings complexity but solves specific performance problems. The key is understanding when each optimization is worth the added complexity.

**Direct Database Calls**: Simple and always up-to-date, but potentially slow for repeated identical requests.

**Memory Cache**: Fast reads for cached data, but requires invalidation logic to stay consistent.

**Search Index**: Fast searches on large datasets, but introduces data duplication and synchronization challenges.

The best approach depends on your specific use case, data size, and consistency requirements. Start simple and add optimizations when you measure actual performance problems.