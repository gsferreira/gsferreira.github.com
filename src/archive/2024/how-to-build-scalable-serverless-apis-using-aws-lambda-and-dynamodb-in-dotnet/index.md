---
layout: post
tags: post
date: 2024-12-20
title: How to Build Scalable Serverless APIs Using AWS Lambda and DynamoDB in .NET
description: 
featured_image: 
---

How much time do you spend managing your infrastructure?
Too much, am I right!?
That's why serverless computing has gained popularity. Serverless eliminate infrastructure management, allowing developers to focus on code and business logic.

This post will guide you through building a serverless API using AWS Lambda and DynamoDB with .NET. We will cover each component, from database to Lambda, and provide a simple example of building a scalable, maintenance-free API.

But first, let me explain all the necessary concepts before the tutorial.

## What is Serverless Computing?

Serverless computing is a relief for developers. Why? It allows them to build and run applications without the pain of managing servers. Cloud providers automatically handle the infrastructure, including scaling, server maintenance, and provisioning. They often rely on a 'pay-as-you-go' model, where you only pay for the compute time used. This makes it cost-effective, especially for occasionally used applications.
That's possible because you build functions rather than services in serverless computing. And you know those functions will be triggered when a specific event occurs.

Key benefits of serverless:

- Automatic Scaling: Resources are scaled automatically based on demand.
- Cost-Effective: Pay only for the compute time your function actually uses.
- Reduced Maintenance: Developers don't need to worry about underlying infrastructure.

Imagine you have a friendly genie who lives in a magic lamp. This genie only comes out when you rub the lamp and ask it to do something specific, like fetch you a glass of water, fix a bug, or make your bed.

That genie is like the serverless API, and rubbing the lamp is like making a request. When you ask for something, the genie appears, does precisely what you asked and then poof—he goes back into the lamp until you need him again. He doesn't sit around waiting for you all day. He only shows up when you need him, does the job, and disappears.


## What is AWS Lambda?

AWS Lambda is Amazon's serverless computing service. Lambda allows you to run code responding to triggers (like HTTP requests or DynamoDB changes). Since it's serverless, you throw the code at AWS, and they will manage the server for you. In Lambda, each piece of code is a Function and AWS charges only for the compute time your function uses.

Advantages of using AWS Lambda:

- Event-Driven Execution: Lambda functions can be triggered by various events (HTTP requests, DynamoDB events, etc.).
- Automatic Scaling: As I mentioned before, Lambdas automatically scale to handle the workload if needed.
- Integrated with AWS Services: Lambda integrates easily with DynamoDB, API Gateway, S3, and other AWS services.

Lambda functions can be written in various languages, including C#. In fact, .NET is an excellent choice for building on AWS.

## What is DynamoDB?

Amazon DynamoDB is a fully managed, serverless, NoSQL database service designed for high-performance and low-latency use cases. It scales automatically based on application demands. Think of it as a document (key-value) store that can store semi-structured or unstructured data.

DynamoDB Features:

- Flexible Data Model: Supports key-value and document data models.
- Fast and Scalable: Dynamically scales to meet application demand.
- Integrated with AWS Services: Works seamlessly with Lambda, API Gateway, etc., for event-driven architectures.
- In this tutorial, we'll use DynamoDB to store data for our API, making building a fully serverless .NET API simple.

## Demo

First, install the AWS CLI through this link: https://aws.amazon.com/cli/

After installing, you need to run the following command to configure your access key:

```shell
aws configure
```

To create an access key you need to set it up in the security credentials tab of your account. 
In my case, the URL is: https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/security_credentials


If you don't have one, you need to set up an AWS account. After creating your account, you can create a table in DynamoDB.
In this example, I'll use the eu-central-1 region.
https://eu-central-1.console.aws.amazon.com/dynamodbv2/home?region=eu-central-1

Name the table Products (careful, this is case sensitive!)

Create a .NET 8 C# library project and install the following libraries:
```csharp
AWSSDK.DynamoDBv2
Amazon.Lambda.Core
Amazon.Lambda.APIGatewayEvents
Amazon.Lambda.Serialization.SystemTextJson
```
In the library, keep only one file named Function.cs, and inside that file, add the following code:

```csharp
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using System;
using System.Text.Json;
using System.Threading.Tasks;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace AWSPlayground;

public class Function
{
    private static readonly AmazonDynamoDBClient _client =
        new AmazonDynamoDBClient("AccessKey", "SecretKey",
            new AmazonDynamoDBConfig
        {
            RegionEndpoint = Amazon.RegionEndpoint.EUCentral1
        });

    private static readonly Table _table = new TableBuilder(_client, "Products")
        .AddHashKey("ProductId", DynamoDBEntryType.String)
        .Build();

    public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest request)
    {
        Console.WriteLine("FunctionHandler called");

        var product = JsonSerializer.Deserialize<Product>(request.Body);

        if (product == null)
        {
            return new APIGatewayProxyResponse
            {
                StatusCode = 400,
                Body = "Invalid product data."
            };
        }

        var document = new Document
        {
            ["ProductId"] = product.ProductId,
            ["Name"] = product.Name,
            ["Price"] = product.Price
        };

        await _table.PutItemAsync(document);

        Console.WriteLine("Product added successfully!");

        return new APIGatewayProxyResponse
        {
            StatusCode = 200,
            Body = "Product added successfully!"
        };
    }
}

public class Product
{
    public string ProductId { get; set; }
    public string Name { get; set; }
    public double Price { get; set; }
}
```

Let's explain what we did here. First, we specified the serializer to be used from AWS for our Lambdas. Then, we created a client that we will use to connect to AWS using the credentials created before. We connected to the Products table created, and in our Function, we added a new product to the database. To test this, we need to deploy our Lambda to AWS. To do this, you need to run:

```shell
dotnet lambda package
```

To prepare our app for the cloud and then run:

```shell
dotnet lambda deploy-function MyLambdaFunction
```

For our example, you can use dotnet8 as our runtime; for memory, set the timeout to 20 seconds, select the role that can read and write into DynamoDB and use AWSPlayground::AWSPlayground.Function::FunctionHandler for describing where our Function is.

Now, if we navigate back to AWS, we can test our Function. For me, the link is: https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/functions/MyLambdaFunction?subtab=general&tab=testing

In the Test tab, we can send a Test Event with a JSON like the one below and add a new product to our database!
```json
{
  "body": "{\"ProductId\":\"P102345601\",\"Name\":\"Laptop\",\"Price\":999.99}"
}
```

You should have added a new product if you have now checked your database. Hope this made it simple

## Conclusion

Integrating .NET with AWS services allows you to leverage the benefits of serverless architecture while sticking to familiar development tools and languages, like our own, C#. This approach is ideal for applications that need to scale automatically or those with intermittent traffic, allowing you to focus on business logic instead of infrastructure details.

Building serverless APIs with AWS Lambda and DynamoDB in .NET became super easy after this post, right? In this one, we deployed a .NET 8 Lambda that just inserted products. But what about cold starts? If you noticed, each request took a significant amount of time. Stay tuned because, in a future post, we will deploy some AOT code that will make our application cost a lot, and our code will run much faster.