---
layout: post
tags: post
date: 2017-07-20

title: Rebuilding SQL Database indexes using Azure Function
category: Azure
---

Do you know that index management is under your responsibility and you need to pay attention to how fragmented they are? If you are reading this post, probably you know that (I hope that you didn't find it in the hard way).

Azure SQL Database takes care of a lot of maintenance tasks, but keeping your Indexes healthy isn't one of them.

Indexes get fragmented and fragmented indexes is a performance killer. The good news is that I can help you dealing with that.

## Do I have a problem?

First let's analyze your database. Read [this article](https://blog.sqlauthority.com/2010/01/12/sql-server-fragmentation-detect-fragmentation-and-eliminate-fragmentation/) to undestand the fragmentation indexs and then execute the following query in your database.

<script src="https://gist.github.com/gsferreira/fbb3419a367730f53922f0809991d264.js"></script>

Scared with the results? If so, keep reading.

## Azure Function

You can find [here](https://github.com/gsferreira/AzureFunctionSQLDefrag) the code of an Azure Function to automate the index maintenance of multiple databases.

The function will run and execute a REBUILD and REORGANIZE for Database Indexs, with a given Threshold.

By default, the Function is configured to Rebuild indexs with more than 30% of fragmentation and reorganize indexs with more than 3% but you can adjust those limits.

You can add a Connection String to multiple databases at the Application Settings where the name has the prefix "Defrag.".

You can find information of how to configure it in the project readme file.

### Important Note!!!

_The default timeout for functions on a Consumption plan is 5 minutes. The value can be increased to 10 minutes max._

_If you have a big database, the function can stop running during the index maintenance and don't finish the job._

_In that case, you probably want to move to an App Service plan or decompose the function splitting the work by multiple functions. If you want some tips of how to accomplish that, please leave a comment._

**References:**

- [https://blog.sqlauthority.com/2010/01/12/sql-server-fragmentation-detect-fragmentation-and-eliminate-fragmentation/](https://blog.sqlauthority.com/2010/01/12/sql-server-fragmentation-detect-fragmentation-and-eliminate-fragmentation/)
- [https://geeks.ms/davidjrh/2015/10/08/rebuilding-sql-database-indexes-using-azure-automation/](https://geeks.ms/davidjrh/2015/10/08/rebuilding-sql-database-indexes-using-azure-automation/)
- [https://alexandrebrisebois.wordpress.com/2013/02/06/dont-forget-about-index-maintenance-on-windows-azure-sql-database/](https://alexandrebrisebois.wordpress.com/2013/02/06/dont-forget-about-index-maintenance-on-windows-azure-sql-database/)
- [https://www.red-gate.com/simple-talk/cloud/cloud-data/azure-sql-database-maintenance/](https://www.red-gate.com/simple-talk/cloud/cloud-data/azure-sql-database-maintenance/)
