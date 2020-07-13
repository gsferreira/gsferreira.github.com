---
layout: post
tags: post
date: 2015-01-29

title: "T-SQL: Which schema is consuming more space?"
category: SQL
---

Imagine that you have separate schemas in your multi-tenant data architecture and you want to know who is consuming more space. How can you do it?

<!--excerpt-->

Just run the following query:

    SELECT  SCHEMA_NAME(obj.schema_id) AS 'Schema',
            SUM(stats.reserved_page_count) * 8.0 / 1024 AS SizeInMB
    FROM    sys.dm_db_partition_stats stats
        JOIN    sys.indexes idx ON idx.object_id = stats.object_id AND idx.index_id = stats.index_id
        JOIN    sys.objects obj ON idx.object_id = obj.object_id
    WHERE   obj.Type = 'U'
    GROUP BY    obj.schema_id
    ORDER BY    SizeInMB DESC 



Hope this helps.