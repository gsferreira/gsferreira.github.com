---
layout: post
tags: post
date: 2021-10-27
title: Azure Storage Integration Testing with Azurite
description: If you depend on Azure Storage, you need a solution to Integration Test in a local development environment.
featured_image: /images/archive/azure/azurite.png
---

If you depend on Azure Storage, you need a solution to [Integration Test](https://martinfowler.com/articles/practical-test-pyramid.html#IntegrationTests) in a local development environment.

We live in a world where we rely more on Cloud offers, using proprietary managed solutions.
One of those examples is Azure Storage (Blobs, Queues, and Tables).

One of the problems with relying on those kinds of offerings is how to have an environment disconnected from Azure to run your code while testing or developing.

Ideally, we want to have a solution to run it in an offline environment. That can give us the following benefits:

- Money savings.
- Extremely fast. No latency involved.
- Isolation. No risk of having a colleague testing against the same environment.
- You don't need to have access to the internet to be working. When the power supply goes off is extremely useful (ask me how I know 😁).

An excellent solution to that in the case of Azure Storage is Azurite.

## What is Azurite?

Azurite is an open-source Azure Storage emulator that provides a cross-platform experience in a local environment. Azurite simulates most of the commands supported by Azure Storage with minimal dependencies.

### How to use it?

Azurite is a Node.js application, so you can npm install it and use it from the command line ([see here](https://github.com/Azure/Azurite#npm)).

But, I prefer to use docker containers, and it's that what we will see here.

First, create a `docker-compose.yml` like the following.

```yaml
version: "3.9"
services:
  azurite:
    image: mcr.microsoft.com/azure-storage/azurite
    hostname: azurite
    restart: always
    ports:
      - "10000:10000"
      - "10001:10001"
      - "10002:10002"
```

Azurite will listen to _10000_ as Blob service port, _10001_ as Queue service port, and _10002_ as the Table service port. Configure the ones you need.

After that, just run your `docker-compose up` and you will be able to connect to it.

```csharp
var connectionString = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;";
var account = CloudStorageAccount.Parse(connectionString);
var client = account.CreateCloudTableClient();
```

Hope that this was useful! To get more tips like this, follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira) and let's keep in touch!
