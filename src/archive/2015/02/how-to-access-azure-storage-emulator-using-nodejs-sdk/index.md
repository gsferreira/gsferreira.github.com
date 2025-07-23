---
layout: post
tags: post
date: 2015-02-06

title: How to access Azure storage emulator using Node.js SDK
description: Connect to Azure Storage Emulator with Node.js SDK using generateDevelopmentStorageCredentials() for local development testing.
category: Azure, Node.js
---

Today I have a quick tip that I want to share with you because it took me some time to figure this out.

I'm using Azure SDK for Node.js to interact with Azure Storage and I want to access my development environment with it.

To access the blob storage, for instance, you just need to create a blob service using the resource name and the access key. Too easy!

```csharp
    var azure = require('azure-storage');
    var blobService = azure.createBlobService('mystorage', 'my-access-key');
```

Now I want to access the Azure Storage Emulator running in my machine. How to do it? Just replace the previous code with the following piece of code.

```csharp
    var azure = require('azure-storage');
    var devStoreCreds = azure.generateDevelopmentStorageCredendentials();
    var blobService = azure.createBlobService(devStoreCreds);
```

Hope this helps.
