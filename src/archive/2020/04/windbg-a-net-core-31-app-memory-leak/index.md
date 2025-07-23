---
layout: post
tags: post
date: 2020-04-15
title: windbg a .net core 3.1 app memory leak
description: Debug .NET Core memory leaks with WinDbg - setup SOS extension, analyze garbage collector handles, and find heap issues.
category: .NET
featured_image: /images/windbg-a-net-core-31-app-memory-leak-load-sos.png
---

I've spent the past few days trying to fix a memory leak. I was having problems to figure out what was leaking, so I used windbg wishing that it would help me.

I confess that I'm not an experienced user of windbg, so I google how to catch memory issues using windbg. There's a ton of information out there. The problem is that I didn't found a guide on how to do it with a .net core application.

So, I'm sharing here how I've done it:

1.  Install windbg ([see here](https://docs.microsoft.com/en-us/windows-hardware/drivers/debugger/debugger-download-tools)).
2.  Add windbg.exe (x64 version) to your environment path.
3.  Install SOS ([see here](https://github.com/dotnet/diagnostics#installing-sos)): `dotnet tool install -g dotnet-sos`.
4.  Set breakpoint(s) using `System.Diagnostics.Debugger.Break()` in your source code.
5.  Update your project (\*.csproj file) to Load Symbols: `<DebugSymbols>true</DebugSymbols><DebugType>pdbonly</DebugType>`.
6.  Build your project using Release configuration: `dotnet build -c Release`.
7.  Launch with WinDbg attached to your project: `windbg dotnet [YOUR DLL PATH].dll`.
8.  [Load SOS](https://bret.codes/net-core-and-windbg/#loadsos) using `.load C:\Users\[USERNAME]\.dotnet\sos\sos.dll .`.

![windbg - load sos](/images/windbg-a-net-core-31-app-memory-leak-load-sos.png)

9.  Enter `g` to go to the first breakpoint.
10. Enter `!gchandles` to see garbage collector handles.
11. `!DumpHeap /d -mt [MT]` using the memory type id from the result list of the previous command. Example: `!DumpHeap /d -mt 00007ffb4c85ca98`
12. `!gcroot -all [ADDRESS]` using the memory address form the result list of the previous command. Example: `!gcroot -all 0x0000023cd2e71510`

Following this guide, you should have a clue of what is still in memory and where the object is in use.

Hope this helps.
