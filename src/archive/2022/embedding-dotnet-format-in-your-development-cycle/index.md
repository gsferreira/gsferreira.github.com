---
layout: post
tags: post
date: 2022-02-11
title: Embedding dotnet format in your development cycle
description: Embed dotnet format in CI/CD pipelines - automate C# code formatting, enforce standards, and reduce code review friction.
featured_image: /images/archive/dotnet/dotnet-format-result.png
---

I have to confess. I've spent more time than acceptable during code reviews, looking into C# code formatting issues. It's such dumb work. I should focus on other things rather than watching if a colleague forgot to format the code or if someone is using a different editor with different rules.

That's one thing that that I miss when writing C# in Visual Studio if I compare it to writing JS in Visual Studio Code. It's so beautiful when Prettier auto-format when I save the file. You define rules in your `.editorconfig` and BOOOM! 💥 No more nitpicking on indentation or whitespaces. You can even enforce other rules like having the System using directives first.

```ini
# .editorconfig Example
# Organize using directives
dotnet_sort_system_directives_first = true
dotnet_separate_import_directive_groups = false
```

And now we can bring the same experience with **dotnet format**!

.NET CLI has introduced a [new command to format](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-format). ["dotnet format"](https://github.com/dotnet/format) was an existing dotnet tool, but now (.NET 6.x SDK and later versions) it's integrated into the CLI. You install the CLI, and you have it.

## How can I use it?

It is a simple command-line tool, so you can integrate it into your CI/CD toolchain.

One interesting "dotnet format" option is to verify if changes should be performed with `--verify-no-changes`. Besides that, you can include only some files in the verification with `--include`.

```
dotnet format --verify-no-changes --include src\Infrastructure\CustomerRepository.cs
```

So, those two arguments are perfect for a CI pipeline.
Every time a PR (Pull Request) is open, you can verify any broken format rule during build time.

## Runing dotnet format with GitHub Actions

You can run it in your prefered build system, being TeamCity, Jenkins, Azure DevOps, etc., but here I will use GitHub Actions.

The process is quite simple. If you go to [GitHub Actions Marketplace](https://github.com/marketplace?type=actions), you will find some extensions to run dotnet format. I will be using ["xt0rted/dotnet-format"](https://github.com/marketplace/actions/dotnet-format) by [Brian Surowiec](https://github.com/xt0rted).

So, I added a step to my workflow:

```yaml
- name: Run dotnet format
      uses: xt0rted/dotnet-format@v1
      with:
        only-changed-files: "true"
```

The workflow:

```yaml
name: .NET

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Setup .NET
        uses: actions/setup-dotnet@v1
        with:
          dotnet-version: 6.0.x

      - name: Run dotnet format
        uses: xt0rted/dotnet-format@v1
        with:
          only-changed-files: "true"

      - name: Restore dependencies
        run: dotnet restore
      - name: Build
        run: dotnet build --no-restore
      - name: Test
        run: dotnet test --no-build --verbosity normal
```

Now, when a PR is open, dotnet format will run to check the changed files. If someone edits a file without formatting, the build will fail.

That is pretty cool, but I would prefer to prevent build attempts because somebody forgot to format a file.

## dotnet format and Git Hooks

So, how can I prevent commits if I forget to format the code?

The answer to that is [Git Hooks](https://githooks.com/).
Git gives you a way to hook in some git steps. So, you can run your code on pre-commit.

You can do that in many ways (see [here](https://github.com/dotnet/format/blob/main/docs/integrations.md)), but I prefer to use ["pre-commit"](https://pre-commit.com/). Pre-commit simplifies your process and offers you an easy way to adopt new hooks. Go take a look. It's pretty cool!

### How to configure pre-commit

First, you need to install pre-commit (see [here](https://pre-commit.com/#install)).

After installed, create a file `".pre-commit-config.yaml"` in the root folder.

Add the following snippet there.

```yaml
repos:
  - repo: https://github.com/dotnet/format
    rev: ""
    hooks:
      - id: dotnet-format
        args: [--folder, --include]
```

Now, install your git hook script:

`pre-commit install`

After this, dotnet format will run every time you `git commit`! 😍

![dotnet format result](/images/archive/dotnet/dotnet-format-result.png)

## Wrapping up

Obviously, one of your teammates may not install "pre-commit" and keep editing files with Sublime, Vim or Notepad 🤷. That's why is important to do it not only as a pre-commit but also as part of the build. One works as a Guard and the other as a feedback cycle improver.

It's quite a simple process, so it's worth trying.

I hope that this was useful! To get more tips like this, follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira) and let's keep in touch!
