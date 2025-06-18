---
layout: post
tags: post
date: 2025-03-07
title: How to Debug .NET Code in Cursor AI (Even on M1/M2 Macs)
description: Unlock .NET debugging in Cursor AI even on M1/M2 Macs with this simple workaround using Samsung's open-source debugger. No more Microsoft VS Code restrictions!
---

https://youtu.be/AV5fYL0GYkk?si=8sI3cGnc5xyOnmYX

So you jumped on the Cursor AI train to write some .NET code but hit a wall when trying to debug it? 

Been there. Done that. Got the error message.

That annoying little message *"Unable to start debugging. NET Debugging is supported only in Microsoft versions of VS Code."* just ruined your flow, huh?

```bash
You may only use the Microsoft Visual Studio NET/C/C++ Debugger (vsdbg) with Visual Studio Code, Visual Studio or Visual Studio for Mac software to help you develop and test your applications.
Unable to start debugging. NET Debugging is supported only in Microsoft versions of VS Code.
```

Well, I've got a solution that works beautifully – even on M1/M2 Macs. Let me walk you through it.

## The Problem

[Cursor AI doesn't have the license to use Microsoft's .NET debugger.](https://github.com/dotnet/core/issues/505) That's why you're getting that pesky error message suggesting you use Visual Studio for Mac (which, by the way, has been retired already).

## The Solution

Samsung (yes, that Samsung) has [created an open-source debugger for .NET](https://github.com/Samsung/netcoredbg) that we can use. Depending on your operating system, the process is slightly different. Here, I'll cover both the standard path and the steps for M1/M2 Mac users.

## Let's Get Started

### Step 1: Install the C# Extension

First things first, install the C# extension in Cursor:
- Search for "C#" in the extensions panel
- Install "ms-dotnettools.csharp"
- When prompted to add missing build and debug elements, click "Yes"

This creates a `.vscode` folder with `launch.json` and `tasks.json` files in your project.

### Step 2: Download the Samsung Debugger

**For Windows/Linux users:**
1. Go to the [Samsung .NET Core Debugger GitHub repo](https://github.com/Samsung/netcoredbg)
2. Find the latest release
3. Download the version for your platform
4. Unzip it somewhere easy to access

**For M1/M2 Mac users:**
Since Samsung doesn't provide arm64 builds, you'll need a community-maintained version:
1. Go to [this community fork](https://github.com/Cliffback/netcoredbg-macOS-arm64.nvim/releases).
2. Download the arm64 version
3. Unzip it somewhere accessible

### Step 3: Modify Your launch.json

Now we need to tell Cursor to use Samsung's debugger instead of Microsoft's:

1. Open the `.vscode/launch.json` file in your project
2. Add a new configuration (while keeping the existing ones):

```json
{
    "name": "netcoredbg",
    "type": "coreclr",
    "request": "launch",
    "preLaunchTask": "build",
    "program": "${workspaceFolder}/bin/Debug/net9.0/YourProject.dll",
    "args": [],
    "cwd": "${workspaceFolder}",
    "console": "internalConsole",
    "pipeTransport": {
        "pipeCwd": "${workspaceFolder}",
        "pipeProgram": "bash",
        "pipeArgs": ["-c"],
        "debuggerPath": "/PATH/TO/netcoredbg/netcoredbg",
        "debuggerArgs": ["--interpreter=vscode"],
        "quoteArgs": true
 },
    "env": {
        "DOTNET_ENVIRONMENT": "Development"
 }
},
```

Replace `"/PATH/TO/netcoredbg/netcoredbg"` with the actual path to the `netcoredbg` executable you downloaded.
Also, use your actual project name instead of `YourProject.dll`.

If you are on Windows, you need to replace this also:

```json
"pipeProgram": "powershell",
"pipeArgs": ["-Command"],
```

### Step 4: Trust Issues (M1/M2 Mac Only)

You'll get security warnings when you first try to run the debugger on macOS. Here's how to handle them:

1. Try to run the debugger (it will fail)
2. Go to System Settings > Privacy & Security
3. Scroll down to the Security section, where you'll see "netcoredbg was blocked"
4. Click "Allow Anyway"
5. Try running again
6. You might need to repeat this process a couple of times for different components

## Let's Test It
1. Set a breakpoint in your code
2. Go to Run and Debug
3. Select your new "netcoredbg" profile
4. Hit the play button

Boom! Your breakpoint should hit, and you can do all the usual debugging stuff.

## Warning

This isn't the same debugger used in Visual Studio, so you might notice some differences. But, in my experience, it works really well.

## Wrapping Up

There you have it – a solution to debug .NET code in Cursor AI, even on M1/M2 Macs. No need to switch to Visual Studio or any other editor.

If you want to grab the demo project with the source code for this post, you can grab it for free on this [link](https://guiferreira.kit.com/080b535a6e).
