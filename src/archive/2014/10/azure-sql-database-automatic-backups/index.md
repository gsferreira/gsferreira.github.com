---
layout: post
tags: post
date: 2014-10-02

title: "Azure SQL Database: Automatic Backups"
category: Azure
---

This week, I've found a new feature in Azure Management Portal that I wished at so many times.

In July, [Scott Guthrie announced the support for Automated SQL Database Exports.](http://weblogs.asp.net/scottgu/windows-azure-july-updates-sql-database-traffic-manager-autoscale-virtual-machines) 

This is awesome because now we can forget the complex powershell scripts to achieve it. Now we can easily configure fully automated exports to a Storage account and, the best part of it, this is a built-in feature of Windows Azure Management Portal.

<!--excerpt-->

If you want to automate the backup of your database, just go your database and jump to the Configuration Section. In this section, you will see the settings available.

![Azure SQL Database: Automatic Backups - Configure screen](/images/azure-sql-database-automatic-backups-configure-screen.jpg)

Here you can configure:

 - The storage account where you want to keep the backup files;
 - The backup frequency;
 - The retention period;

Lastly, you'll need to enter the SQL Database login name and password.

So far as I know, you just pay the storage space.

Hope this helps.