---
layout: post
tags: post
date: 2015-05-12
title: Azure App Service API Apps - Microsoft Rest HttpOperationException
description: Troubleshoot Azure App Service API Apps Microsoft.Rest.HttpOperationException errors with debugging techniques and solutions.
category: Azure
---

Recently I was playing with API Apps, from the new Azure App Service when I faced the following error:

```csharp
Microsoft.Rest.HttpOperationException`1 was unhandled
  HResult=-2146233088
  Message=Exception of type 'Microsoft.Rest.HttpOperationException`1[System.Object]' was thrown.
  Source=MyMailSenderClient2
  StackTrace:
       at MyMailSenderClient2.Mail.<PostWithOperationResponseAsync>d__0.MoveNext() in c:\DEV\MyTestApi\MyMailSenderClient2\TestMailApi\Mail.cs:line 129
    --- End of stack trace from previous location where exception was thrown ---
       at System.Runtime.CompilerServices.TaskAwaiter.ThrowForNonSuccess(Task task)
       at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)
       at System.Runtime.CompilerServices.ConfiguredTaskAwaitable`1.ConfiguredTaskAwaiter.GetResult()
       at MyMailSenderClient2.MailExtensions.<PostAsync>d__3.MoveNext() in c:\DEV\MyTestApi\MyMailSenderClient2\TestMailApi\MailExtensions.cs:line 42
    --- End of stack trace from previous location where exception was thrown ---
       at System.Runtime.CompilerServices.TaskAwaiter.ThrowForNonSuccess(Task task)
       at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)
       at System.Runtime.CompilerServices.TaskAwaiter`1.GetResult()
       at MyMailSenderClient2.MailExtensions.Post(IMail operations, MailModel data) in c:\DEV\MyTestApi\MyMailSenderClient2\TestMailApi\MailExtensions.cs:line 24
       at MyMailSenderClient2.Program.Main(String[] args) in c:\DEV\MyTestApi\MyMailSenderClient2\Program.cs:line 16
       at System.AppDomain._nExecuteAssembly(RuntimeAssembly assembly, String[] args)
       at System.AppDomain.ExecuteAssembly(String assemblyFile, Evidence assemblySecurity, String[] args)
       at Microsoft.VisualStudio.HostingProcess.HostProc.RunUsersAssembly()
       at System.Threading.ThreadHelper.ThreadStart_Context(Object state)
       at System.Threading.ExecutionContext.RunInternal(ExecutionContext executionContext, ContextCallback callback, Object state, Boolean preserveSyncCtx)
       at System.Threading.ExecutionContext.Run(ExecutionContext executionContext, ContextCallback callback, Object state, Boolean preserveSyncCtx)
       at System.Threading.ExecutionContext.Run(ExecutionContext executionContext, ContextCallback callback, Object state)
       at System.Threading.ThreadHelper.ThreadStart()
  InnerException:
```

I struggled a bit until I figured why.

Well, let me explain you how I got there and what I have done to solve it.

I access to the new [Portal](http://portal.azure.com) and I created a new API App, then I've followed the Microsoft tutorial of how to [Create an ASP.NET API app in Azure App Service](http://azure.microsoft.com/en-us/documentation/articles/app-service-dotnet-create-api-app/).

Everything was going fine and in a few minutes I published the API. Quick and easy.

Then, I generated my Client SDK and when I tried to invoke it, I got the error.

As you can see, the exception message and the stack trace don't provide much information.

I had to struggle a bit to figure it out.

The reason was really simple, my API service had the Access Level defined as **Internal**.

After changing it to **Public (anonymous)** everything works fine.

![Azure API App - Access Level](/images/azure-app-service-api-apps-microsoft-rest-httpoperationexception-access-level.png)

Why this happened? If you follow the tutorial you will create the API App using Visual Studio and you will see that the Visual Studio has the access level **Available to Anyone** as default.

When you create the API App using the portal, you will see that the Access Level is defined as **Internal** by default.

I believe that Microsoft will fix these small problems and make it more clear.
Until then, I hope that this helps you.
