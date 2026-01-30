---
layout: post
tags: post
date: 2026-01-30
title: How to use AGENTS.md to define AI Rules across any IDE
description: Learn how AGENTS.md gives your team one standard file to define AI coding rules that work in Cursor, VS Code, GitHub Copilot, and more.
---

https://www.youtube.com/watch?v=5znDJoWyJw8

If you work with AI agents while coding, you've probably noticed something annoying: every IDE has its own system for rules and instructions. Cursor uses [MDC files](/archive/2026/how-to-use-cursor-rules-to-plan-and-execute-tasks/), VS Code has its own ways, and GitHub Copilot reads configuration differently.

So if your team uses different tools, how do you keep everyone's AI assistant on the same page?

That's where **agents.md** comes in.

---

## What Is AGENTS.md?

It's a simple Markdown file you drop at the root of your project. Inside it, you describe everything that matters for your AI agents: structure, conventions, rules, and behaviour.

Think of it as a README for your AI assistants. Your README stays clean for humans. [AGENTS.md](https://agents.md/) becomes the go-to reference for agents.

It's already an open format used by more than 20,000 open source projects, and it works with tools like **VS Code**, **Cursor**, **GitHub Copilot**, **Google Jules**, and **Devin**. Claude Code doesn't support it yet, but you can link it manually.

---

## What to Put Inside AGENTS.md

Here are the types of sections you can include.

### Do and Don't Rules

These guide the agent toward the patterns you expect and away from the ones you don't. Example:

**Do:**

- Follow C# naming conventions
- Use nullable reference types and handle nullability properly
- Implement async/await patterns for I/O operations
- Use dependency injection through the built-in container
- Use record types for DTOs and value objects
- Use configuration through IConfiguration and the options pattern
- Write comprehensive unit tests following the AAA pattern (Arrange, Act, Assert)

**Don't:**

- Ignore compiler warnings or nullable reference type warnings
- Use Task.Result or .Wait(), always prefer async/await
- Use magic strings for configuration keys
- Use exceptions to control normal flow
- Commit code with failing tests or build warnings

---

### Commands

This is useful for the agent to run tests, builds, or the application correctly.

**Run**

```shell
dotnet run --project [ProjectName]
```

**Tests**

```shell
dotnet test --verbosity normal
dotnet test --collect:"XPlat Code Coverage" --logger trx
dotnet test --filter "Category!=Integration"
```

**Build**

```shell
dotnet build --configuration Release --no-restore
dotnet publish --configuration Release --output ./publish
```


---

### Project Structure Hints

If your project uses something like Clean Architecture, DDD, or vertical slices, you can describe the folder structure so the agent knows where to create or edit files.

This is especially useful when the project follows patterns like src/ and tests/, or when naming is important.

---

### Good and Bad Examples

Examples help the agent understand the expected style.

**Good controller:**

```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        return user is null ? NotFound() : Ok(user);
    }
}
```

**Bad controller:**

```csharp
public class UserController : ControllerBase
{
    [HttpGet("{id}")]
    public ActionResult<User> GetUser(int id)
    {
        using var context = new AppDbContext();
        var user = context.Users.Find(id);
        return user;
    }
}
```

---

### When the Agent Gets Stuck

AI assistants sometimes enter loops trying to fix the same bug repeatedly. A section like this helps them switch strategies:

- Ask clarifying questions
- Propose 2 or 3 alternative implementation options with trade-offs
- Create a small spike or proof-of-concept
- Open a draft PR with notes
- Reference documentation (Microsoft docs or internal guidelines)
- Check if the problem requires domain expert input

---

### Git Workflows

If you want your AI agent to perform commits or create pull requests, you can add a section describing commit message conventions, branch naming, or PR requirements.

This helps when team members use different agents but want a consistent Git workflow.

---

## Wrapping Up

AGENTS.md is not a replacement for IDE-specific workflows, but it's an important step towards unifying how teams guide AI agents. When used well, this single file becomes the heart of your project for all automated assistance, no matter the tool.

If you want to see this in action and [grab the template](https://gui-ferreira.kit.com/8bc2e1048c), watch the [full walkthrough](https://www.youtube.com/watch?v=5znDJoWyJw8) where everything is explained in more detail.
