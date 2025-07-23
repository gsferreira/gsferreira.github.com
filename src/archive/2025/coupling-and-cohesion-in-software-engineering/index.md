---
layout: post
tags: post
date: 2025-03-03
title: Coupling and Cohesion in Software Engineering
description: Software engineering coupling and cohesion fundamentals - build maintainable code with low coupling and high cohesion principles.
featured_image: /images/archive/highlight/coupling-and-cohesion-in-software-engineering.png
---

I've been in the software trenches for YEARS, and let me tell you something: those fancy-pants concepts like coupling and cohesion ain't just academic BS... they're the SECRET SAUCE of maintainable code!

In the next 3 minutes, I'm gonna share how these two concepts have saved me countless times, show you ACTUAL CODE from real-world projects, and reveal why understanding them can lead to cleaner, more maintainable software.

## What's Coupling?

Coupling is how much one piece of your code relies on another. Our goal is to achieve **low coupling** between components. I've seen firsthand how *tightly coupled* modules can turn a minor tweak into a debugging nightmare. When a change in one part sends shockwaves through your entire system, it's a clear sign you're dealing with tight coupling. On the other hand, *loosely coupled* systems let you swap out or tweak components without causing a cascade of unexpected issues.

Let's imagine a service that sends emails. If that service has a method that needs the customer to be passed as a parameter, then that means that this service is tightly coupled with the customer model. You cannot extract it somewhere else unless you refactor it. Let me show you an example.

```csharp
public class Customer
{
    // Other properties
    public string Email { get; set; }
}

public class EmailService
{
    public void SendEmail(Customer customer, string message)
 {
        Console.WriteLine($"Sending email to {customer.Email}: {message}");
 }
}

var customer = new Customer { Email = "fernando.pessoa@poetas.pt" };
var emailService = new EmailService();
emailService.SendEmail(customer, "Hello, welcome!");
```

The SendEmail method is tightly coupled with the customer model, and the service directly depends on the customer's class. The loosely coupled alternative can look like this:

```csharp
public interface IEmailRecipient
{
    string Email { get; }
}

public class Customer : IEmailRecipient
{
    public string Email { get; set; }
}

public class EmailService
{
    public void SendEmail(IEmailRecipient recipient, string message)
    {
        Console.WriteLine($"Sending email to {recipient.Email}: {message}");
    }
}

IEmailRecipient recipient = new Customer { Email = "fernando.pessoa@poetas.pt" };
var emailService = new EmailService();
emailService.SendEmail(recipient, "Hello, welcome!");
```

Now, this method accepts any IEmailRecipient, which makes it loosely coupled. The EmailService no longer depends on the concrete Customer class but on the abstraction IEmailRecipient. This makes your service easier to reuse with different models that implement the interface. That's the flexibility we were looking for.

You can further reduce coupling by using dependency injection:

```csharp
public class NotificationManager
{
    private readonly EmailService _emailService;
    
    // Constructor injection
    public NotificationManager(EmailService emailService)
    {
        _emailService = emailService;
    }
    
    public void NotifyCustomer(IEmailRecipient customer, string message)
    {
        _emailService.SendEmail(customer, message);
    }
}
```

This approach follows the **Dependency Inversion Principle** (the 'D' in SOLID), where high-level modules depend on abstractions, not concrete implementations.

## What's Cohesion?

Cohesion measures how closely related the responsibilities within a single module are. Our goal is to achieve **high cohesion** within components. *A highly cohesive class does one thing and does it well.* When classes take on too many responsibilities, they become harder to understand, test, and maintain. This is what the **Single Responsibility Principle** (the 'S' in SOLID) refers to.

Imagine your office desk. In a well-organized desk, every tool, the pens, the notepad, and even a stapler, serves a clear, related purpose. Everything is in its place so that you can focus on one task. Now, picture a cluttered desk where random items, like a kitchen spatula, a gardening tool, and a phone charger, are all mixed together. That's low cohesion: the items (or functions) have little in common, making it hard to work efficiently. *In code, high cohesion means a class has a clear, focused responsibility*, which makes it easier to understand and maintain.

Let's look at a practical example of low cohesion. Here's a service responsible for both email and SMS notifications:

```csharp
public class NotificationService
{
    public void SendEmail(string email, string message)
    {
        Console.WriteLine($"Sending email to {email}: {message}");
    }
    
    public void SendSms(string phoneNumber, string message)
    {
        Console.WriteLine($"Sending SMS to {phoneNumber}: {message}");
    }
}

var notificationService = new NotificationService();
notificationService.SendEmail("fernando.pessoa@poetas.pt", "Welcome via Email!");
notificationService.SendSms("902223344", "Welcome via SMS!");
```

In a high cohesion example, we separate the responsibilities into dedicated classes:

```csharp
public class EmailService
{
    public void SendEmail(string email, string message)
 {
        Console.WriteLine($"Sending email to {email}: {message}");
 }
}

public class SmsService
{
    public void SendSms(string phoneNumber, string message)
    {
        Console.WriteLine($"Sending SMS to {phoneNumber}: {message}");
    }
}

var emailService = new EmailService();
emailService.SendEmail("fernando.pessoa@poetas.pt", "Welcome via Email!");

var smsService = new SmsService();
smsService.SendSms("902223344", "Welcome via SMS!");
```

These separate services can still work together through composition:

```csharp
public class NotificationCoordinator
{
    private readonly EmailService _emailService;
    private readonly SmsService _smsService;
    
    public NotificationCoordinator(EmailService emailService, SmsService smsService)
    {
        _emailService = emailService;
        _smsService = smsService;
    }
    
    public void NotifyThroughAllChannels(string email, string phone, string message)
    {
        _emailService.SendEmail(email, message);
        _smsService.SendSms(phone, message);
    }
}
```

## The Coupling–Cohesion Balance

*Achieving the delicate balance between low coupling and high cohesion is an art.* When every module is designed to focus on a single, clear responsibility, you naturally reduce the dependencies between different parts of your system. This focus makes each component easier to understand and test and minimizes the risk that changes in one area will ripple unpredictably through your application.

However, in real projects, you face constraints like tight deadlines, legacy code, or resource limitations that force you to make trade-offs. In these situations, you might accept slightly higher coupling or lower cohesion to get the code to production on time. 

Sometimes, higher coupling is acceptable within a bounded context.

**The challenge lies in measuring the benefits of complete isolation against the practical needs of your project.** It's easy to over-abstract and create code that's hard to maintain due to excessive indirection.

**Over-abstraction is the silent killer of projects.**
**Balance is the name of the game.**


Next time you are about to write a class, try to think why you are creating it. If you want to see more of this, watch the video below, where I explain this in detail. 👇

https://youtu.be/7pdrZDqEPIw