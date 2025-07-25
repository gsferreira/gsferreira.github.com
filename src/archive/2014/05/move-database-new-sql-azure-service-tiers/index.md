---
layout: post
tags: post
date: 2014-05-03

title: Move your database to new SQL Azure Service Tiers
description: Step-by-step guide to migrate SQL databases to new Azure Basic and Standard tiers with bacpac export/import and troubleshooting tips.
category: Azure
---

In the last Build conference Scott Guthrie announced the new Basic and Standard tier option to the SQL Databases on Azure. Those tiers bring amazing features and you can find more about them in the [Scott's post](https://prod-static-asp-blogs.azurewebsites.net/scottgu/azure-99-95-sql-database-sla-500-gb-db-size-improved-performance-self-service-restore-and-business-continuity/?). If you want to try it, as I did, go ahead and take advantage of the 50% discount during the preview period.

You can find here how to move your SQL Database currently in the Web or Business edition using the following tips.

Before you start, make sure that you have a Windows Azure Storage Account and a container in it.

First of all you should take your web site or any client of your database offline, just to ensure that no one updates the database during this operation.

Open a connection to your SQL Server using SQL Management Studio. Right click on your database. Choose _"Tasks > Export Data-tier Application"_. Make sure that you store the bacpac file in your Windows Azure Storage. You can find a good example [here](https://blogs.msdn.com/b/brunoterkaly/archive/2013/09/26/how-to-export-an-on-premises-sql-server-database-to-windows-azure-storage.aspx?Redirected=true).

**Now you need to create a SQL Server before create the database**, by some reason (probably a "preview version bug") if you try to import the database before create the server you will get an error. So, go to Azure Manage web site and create a new SQL Server. Make sure that you set the "Supported Database Editions" to "Basic, Standard, Premium".

![alt text](/images/move-database-new-sql-azure-service-tiers-create-server.png "Create a new server")

After that, add a new SQL Database (imported from the previous backup) to the server created in the last step.

![alt text](/images/move-database-new-sql-azure-service-tiers-import-database.png "Create a new database menu")

Select the Backup that you made, choose one of the Preview Editions and the server created before.

When the create database operation is completed, just update your connection string and you are ready to go.

Just remember to delete the backup from storage and the old server if you want.

Enjoy it!
