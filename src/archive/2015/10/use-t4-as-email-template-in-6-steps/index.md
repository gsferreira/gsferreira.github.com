---
layout: post
tags: post
date: 2015-10-23

title: Use T4 as email template in 6 steps
---

When you want to send emails from .net applications how do you do it?

Do you create an instance of StringBuilder and start adding texts?!

And when you want to format the body as HTML? How do you do it?! A bigger string?!

And if you could write your templates as plain text and still be capable to inject values like names, dates or other values?
The good news is that you can and you have a good old friend to help you: **T4 Templates**.

Let's see how to do it.

**1. Open your project and add a template**

Right click in your project and go to the option "Add > New Item", select the "Runtime Text Template" and name it **("WelcomeMail.tt" for example)**.

![Create T4 Templates](/images/use-t4-as-email-template-in-6-steps-create-t4-template.png)

**2. Create your text template**

Open the template (**.tt file**) and write your email with all the HTML formatting that you want.
_Find an Html Mail template example [here](https://github.com/leemunroe/responsive-html-email-template)_

```html
<#@ template language="C#" #> <#@ assembly name="System.Core" #> <#@ import
namespace="System.Linq" #> <#@ import namespace="System.Text" #> <#@ import
namespace="System.Collections.Generic" #>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body
    style="width:100%; margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;"
  >
    <p>
      <strong>Hello!</strong>
    </p>
    <p>
      Lorem ipsum dolor sit amet, congue appareat cum ne. Sit postea mediocrem
      an, erat dissentiet est an. Eu est eius veri assum, et nam sonet molestiae
      urbanitas. Cu minim cetero nam, utamur accumsan ius in. Est et sint
      quaestio, cu his primis invenire rationibus.
    </p>
    <p>
      Cibo senserit mnesarchum qui te, sonet ceteros evertitur ad ius, an eam
      autem mediocrem scribentur. In esse vero sapientem eos, modus consequuntur
      sit ei, ius et sale fabulas. Te populo commodo gubergren sed, pri autem
      discere in, accumsan antiopam an usu. Per viris veniam prompta et. In est
      quas virtute, mea accumsan invidunt id, usu ad cibo justo imperdiet.
    </p>
  </body>
</html>
```

**3. Create variables to use into the template**

First you need to create a partial class for the T4 template that you created in the step 2.

In your partial add a property for each value that you want to inject into the template (destination email or signature for example).

Create a constructor to initialize the properties that you have created.

```csharp
using System.Net.Mail;

namespace MailT4Template
{
	public partial class WelcomeMail
	{
		public MailAddress To { get; set; }
		public WelcomeMail(MailAddress to)
		{
			this.To = to;
		}
	}
}
```

**4. Adapt the template to use the injected values**

Just open a C# block code with the tags **<#** and **#>** and use the equal operator to get the variable value.

```html
<strong>Hello <#= To.DisplayName #>!</strong>
```

**5. Transform the text template**

Invoke the template with the parameters to get the transformed text.

```csharp
var to = new MailAddress("luke@starwars.com", "Luke");
WelcomeMail mailTemplate = new WelcomeMail(to);
mailTemplate.TransformText();
```

**6. Compose your email**

Use the transformed text and send the email.

```csharp
var from = new MailAddress("mail@mail.com");
var to = new MailAddress("luke@starwars.com", "Luke");

WelcomeMail mailTemplate = new WelcomeMail(to);

var mail = new MailMessage(from, to);
var client = new SmtpClient();
client.Port = 587;
client.DeliveryMethod = SmtpDeliveryMethod.Network;
client.UseDefaultCredentials = false;
client.EnableSsl = true;
client.Credentials = new NetworkCredential("admin@mail.com","UseTheForce#");
client.Host = "mail.mail.com";

mail.Subject = "This is a welcom email.";
mail.IsBodyHtml = true;
mail.Body = mailTemplate.TransformText();
client.Send(mail);
```

I hope that this helps you.
