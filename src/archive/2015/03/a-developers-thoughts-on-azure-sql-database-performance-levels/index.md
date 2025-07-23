---
layout: post
tags: post
date: 2015-03-14

title: A developer's thoughts on Azure SQL Database performance levels
description: Azure SQL Database performance tiers analysis - comparing Web/Business models to new Basic/Standard/Premium pricing and performance.
category: Azure
---

I recently started moving some databases that I have in the old Azure SQL Database Web/Business model. I started it with a good feeling. Let's face it, a guaranteed performance level is excellent. Nobody wants a noisy neighbor boring our database.

The downside, is that this shift brings new challenges and possible big troubles to the ones that already have systems in place. Everything has a price and in this case we call it **Performance**.

In this new model, SQL Azure Databases are paid by performance instead of space. Now we have service tiers with transaction rates per hour (Basic Tier), per minute (Standard Tier) or per second (Premium Tier).

So, what's wrong with this? The prices! In my opinion, there's no equality between the old models and the new ones. Chris Bailiss has some awesome posts that shows that. Take a look:

- [Azure SQL Database: v12 GA Performance inc. CPU Benchmaring](https://cbailiss.wordpress.com/2015/01/31/azure-sql-database-v12-ga-performance-inc-cpu-benchmaring/)
- [GA Performance in New Azure SQL Database Performance Tiers](https://cbailiss.wordpress.com/2014/09/16/performance-in-new-azure-sql-database-performance-tiers/)

###Show me the numbers

If you have an Azure SQL Database on the Web model with 1.5GB you will pay 10.42€/month.
By a few more cents (11.18€/month) you can use an SQL Database in the Standard Tier with the S0 Performance Level.

If you have read the Chris Bailiss post, you have seen that the performance between those two can't be compared. S0 is slower than Web.

###So, what can I do?

With this post **I don't want to say that you should run away from SQL Azure Database**. What I mean, is that the game has changed.

In this Cloud era the costs are a variable that Software Developers and Architects need to take in account. Now our code has a visible and measurable impact in the financial health of our products and companies.

So, how to start facing the dragon?
You can find here a list of things that you should have in mind:

- **Question yourself: Do I really need a SQL database?** There's many options in Azure to store your data, probably they can do the task.
- **Performance is more important than ever!** Don't wait until a query takes a few minutes running to start doing SQL Tuning.
- **Database design has a significant importance!** Be careful designing your database data model.
- **Test in Azure since the first day.** Probably your development machine has an SQL Server with more power than the production database.

![Works fine in Dev](/images/a-developers-thoughts-on-azure-sql-database-performance-levels-works-fine-in-dev.jpg)

- **Reduce the "chatty"** operations in your application.
- **Be careful using Entity Framework.** Make sure that your code isn't triggering multiple queries that can be done at once. EF can make your life easier, but the database can suffer from that.
- **Start using cache.** This will reduce the workload at your database and you will consume less DTUs.

Hope this helps.
