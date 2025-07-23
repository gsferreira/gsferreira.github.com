---
layout: post
tags: post
date: 2014-07-15

title: Analyse Azure Log Tables using SQL Queries
description: Query Azure diagnostic logs with SQL using AzureLogSpelunker tool. Escape slow Azure Storage Explorer with fast, local SQLite analysis.
category: Azure
---

If you are using [Diagnostics](http://azure.microsoft.com/en-us/documentation/articles/cloud-services-dotnet-diagnostics/) in Microsoft Azure, probably you walked through the horrible experience of analyse that data, specially if you are looking for a specific TimeStamp in the middle of tons of records.

This is so slow because the TimeStamp column, in Azure Table Storage, isn't indexed, but if you take a closer view, you will see that the partition key of WADLogTable is the date-time in ticks, and querying by the partition key is incredible fast.

If you want to query your table manually you will need to convert your date into ticks like this:

```csharp
    DateTime dt = new DateTime(2014, 07, 15, 0,0,0);
    long tks = dt.Ticks;
    Console.WriteLine(tks);
```

This can be useful, but in some cases you will need to query over the "Message" column and that can be hard.

To overtake this difficulty, recently I was looking for a way to run SQL queries over the WADLogsTable since the Azure Storage Explorer isn't a good help. So, I have found this great tool [AzureLogSpelunker](https://github.com/SageLukeDean/AzureLogSpelunker) by [Luke Dean](https://github.com/SageLukeDean).

![AzureLogSpelunker](/images/analyse-azure-log-tables-using-sql-queries-azurelogspelunker.png)

AzureLogSpelunker can be used to request the logs for a specific period, then the tool will cache them locally in a SQLite database where you may run SQL queries. This tool is a must have if you are using the Microsoft Azure Platform.

I hope this helps you.
