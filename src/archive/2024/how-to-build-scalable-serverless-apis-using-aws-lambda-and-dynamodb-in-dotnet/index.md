---
layout: post
tags: post
date: 2024-12-20
title: How to Build Scalable Serverless APIs Using AWS Lambda and DynamoDB in .NET
description: 
featured_image: 
---

Serverless computing has gained popularity for its ability to eliminate infrastructure management, allowing developers to focus on code and business logic. This post will guide you through building a serverless API using AWS Lambda and DynamoDB with .NET, covering each component, from DB to the Lambda and providing a simple example to building a scalable, maintenance-free APIs. Now, let's explain all the concepts necessary before we go to a demo.

## What is Serverless Computing?

Serverless computing lets developers build and run applications without managing servers. What does that mean? With serverless, cloud providers automatically handle the infrastructure, including scaling, server maintenance, and provisioning. Serverless is often billed as “pay-as-you-go,” where you only pay for the compute time used, making it cost-effective (when our code is optimised), especially for sporadically used applications. In serverless, the focus is on functions rather than services, encapsulating the logic to be executed when a certain event occurs.

Key benefits of serverless:

- Automatic Scaling: Resources are scaled automatically based on demand.
- Cost-Effective: Pay only for the compute time your function actually uses.
- Reduced Maintenance: Developers don’t need to worry about underlying infrastructure.

Imagine you have a friendly genie who lives in a magic lamp. Now, this genie only comes out when you rub the lamp and ask them to do something specific, like fetch you a glass of water, fix a bug or make your bed.

In this story, the genie is like the serverless API, and rubbing the lamp is like making a request. When you ask for something, the genie appears, does exactly what you asked and then poof—he goes back into the lamp until you need him again. He doesn’t sit around waiting for you all day. He only shows up when you need him, does the job, and disappears.

## What is AWS Lambda?

AWS Lambda is Amazon’s serverless computing service. Lambda allows you to run code in response to triggers (like HTTP requests or DynamoDB changes) without managing the server on which it runs. In Lambda, each piece of code is a function, and AWS charges only for the compute time your function uses.

Advantages of using AWS Lambda:

- Event-Driven Execution: Lambda functions can be triggered by various events (HTTP requests, DynamoDB events, etc.).
- Automatic Scaling: As I meantioned before, Lambdas automatically scale to handle the workload if needed.
- Integrated with AWS Services: Lambda integrates easily with DynamoDB, API Gateway, S3, and other AWS services.

Lambda functions can be written in various languages, including C#, making it a nice choice for .NET developers building serverless solutions.

## What is DynamoDB?

Amazon DynamoDB is a fully managed, serverless, NoSQL database service. DynamoDB is designed for high performance, low-latency use cases and scales automatically based on application demands. It is a document and key-value store that can store semi-structured, or unstructured data.

DynamoDB Features:

- Flexible Data Model: Supports key-value and document data models.
- Fast and Scalable: Dynamically scales to meet application demand.
- Integrated with AWS Services: Works seamlessly with Lambda, API Gateway, etc., for event-driven architectures.
- In this tutorial, we’ll use DynamoDB to store data for our API, making it simple to build a fully serverless .NET API.

## Demo

First, Install the AWS CLI through this link: https://aws.amazon.com/cli/

After installing you need to run the following command:

```shell
aws configure
```

to configure your access key. To create an access key you need to set it up in the security credentials tab of your account. 
In my case the url is: https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/security_credentials

Now if you don't have one, you need to setup an AWS account. After creating your account, you can create a table in DynamoDB.
In this example, I 'll use eu-central-1 region.
https://eu-central-1.console.aws.amazon.com/dynamodbv2/home?region=eu-central-1

Name the table Products (careful, this is case sensitive!)

Create a .NET 8 C# library project and install the following libraries:
```csharp
AWSSDK.DynamoDBv2
Amazon.Lambda.Core
Amazon.Lambda.APIGatewayEvents
Amazon.Lambda.Serialization.SystemTextJson
```
In the libray, keep only one file, named Function.cs and inside that file add the following code:

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

Let's explain what we did here. First we specified the serializer to be used from AWS for our Lambdas. Then, we created a client that we will use to connect to AWS using the credentials created before. We connected to the Products table that was created and in our function, we are adding a new product to the database. Now, to test this we need to deploy our Lambda to AWS. To do this you need to run:

```shell
dotnet lambda package
```

to prepare our app for the cloud and then run:

```shell
dotnet lambda deploy-function MyLambdaFunction
```

For our example you can use dotnet8 as our runtime,  for memory, set the timeout to 20 seconds, select the role that can read and write into DynamoDB and use AWSPlayground::AWSPlayground.Function::FunctionHandler for describing where our function is.

Now if we navigate back to AWS, we can test our function. For me the link is: https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1#/functions/MyLambdaFunction?subtab=general&tab=testing

In the Test tab, we can send a Test Event with a JSON like the one below and add a new product to our database!
```json
{
  "body": "{\"ProductId\":\"P102345601\",\"Name\":\"Laptop\",\"Price\":999.99}"
}
```

If you now check your DB you should have a new product added. Hope this made it simple

## Conclusion

Integrating .NET with AWS services allows you to leverage the benefits of serverless architecture while sticking to familiar development tools and languages, like our own, C#. This approach is ideal for applications that need to scale automatically or those with intermittent traffic, allowing you to focus on business logic instead of infrastructure details.

Building serverless APIs with AWS Lambda and DynamoDB in .NET got super easy after this post, right? In this one we deployed a .NET 8 Lambda that just inserted products. BUT, what about cold starts? If you noticed, each request took a significant amount of time. Stay tuned because in a future post, we will deploy some AOT code that will make our application cost a lot and our code will run much faster.