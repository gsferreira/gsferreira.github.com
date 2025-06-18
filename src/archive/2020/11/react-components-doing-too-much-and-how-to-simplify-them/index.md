---
layout: post
tags: post
date: 2020-11-16
title: React components doing too much (and how to simplify them)
description: Do you have the feeling that some of your components are doing too much? Do you have too many boolean props? Find here how to simplify them.
featured_image: /images/archive/react/bool-props.png
---

Do you have the feeling that some of your components are doing too much?

Do you remember that time you added a new boolean prop to act as a flag to condition the render? That happens a lot, but those small changes sometimes can have huge impacts in the future.

Feature after feature, change after change, components tend to become more complex. If we are not watching for it, they will be out of control, and that will lead us to be afraid of change.

That's why **we need to be careful with component contracts**. That contract is expressed through props by the way.

One way to spot eventual problems is to look for boolean props [(they will yell at you as you can read here)](https://guiferreira.me/archive/2020/05/that-flag-argument-is-yelling-at-you/). A usual case is to have boolean props used as a way to condition the render.

![React component boolean props definition](/images/archive/react/bool-props.png)

There are a few problems with that approach:

- The component contract can become complex and the state of the component difficult to evaluate.
- It can be a symptom that the component is doing too much.

Let's take a look.

## Complex Contract

Imagine that you have to create a login Component where the user can log in using username.

```jsx
import React from "react";

function Login() {
  return (
    <div className="Login">
      <form>
        <p>
          <label>Username:</label>
          <input type="text" />
        </p>
        <p>
          <label>Password:</label>
          <input type="password" />
        </p>
        <p>
          <input type="submit" value="Log In" />
        </p>
      </form>
    </div>
  );
}

export default Login;
```

One day, you have to review the login Component so the consumer can decide if the user will log in using username or email. A quick fix to achieve that is to create a component with a boolean prop in case the consumer prefers email:

```jsx
import React from "react";
import PropTypes from "prop-types";

function Login({ usingEmail }) {
  return (
    <div className="Login">
      <form>
        <p>
          <label>{usingEmail ? "Email:" : "Username:"}</label>
          <input type={usingEmail ? "email" : "text"} />
        </p>
        <p>
          <label>Password:</label>
          <input type="password" />
        </p>
        <p>
          <input type="submit" value="Log In" />
        </p>
      </form>
    </div>
  );
}

Login.propTypes = {
  usingEmail: PropTypes.bool,
};

export default Login;
```

Now imagine that one day, users can also log in with phone number. Now you have a problem.

The boolean flag isn't extensible to support three variants, and following the same strategy, we would get contradicting boolean props. The consumer of the component would be capable of configuring the Component with a username and phone login, for example.

```jsx
import React from "react";
import PropTypes from "prop-types";

function Login({ usingEmail, usingPhoneNumber }) {
  return (
    <div className="Login">
      <form>
        <p>
          <label>
            {usingEmail ? "Email:" : usingPhoneNumber ? "Phone" : "Username:"}
          </label>
          <input
            type={usingEmail ? "email" : usingPhoneNumber ? "tel" : "text"}
          />
        </p>
        <p>
          <label>Password:</label>
          <input type="password" />
        </p>
        <p>
          <input type="submit" value="Log In" />
        </p>
      </form>
    </div>
  );
}

Login.propTypes = {
  usingEmail: PropTypes.bool,
  usingPhoneNumber: PropTypes.bool,
};

export default Login;
```

Contracts with boolean flags are complex and deliver a bad UX to the consumer.

It complicates component signature, yelling that this component does more than one thing. It does one thing if the flag is "True" and another if the flag is "False".
In the example, the worst is that the consumer doesn't know what to expect when both props are "True".

### So, what to do?

A simple solution would be to **prefer Enums over booleans.** A boolean is extensible and describes a clear intention.

```jsx
import React from "react";
import PropTypes from "prop-types";

const USER_IDENTIFIFICATION_TYPES = {
  USERNAME: "username",
  EMAIL: "email",
  PHONENUMBER: "phone",
};

function Login({ userIdentificationType }) {
  const shouldUseEmail =
    userIdentificationType === USER_IDENTIFIFICATION_TYPES.EMAIL;
  const shouldUsePhone =
    userIdentificationType === USER_IDENTIFIFICATION_TYPES.PHONENUMBER;

  return (
    <div className="Login">
      <form>
        <p>
          <label>
            {shouldUseEmail ? "Email:" : shouldUsePhone ? "Phone" : "Username:"}
          </label>
          <input
            type={shouldUseEmail ? "email" : shouldUsePhone ? "tel" : "text"}
          />
        </p>
        <p>
          <label>Password:</label>
          <input type="password" />
        </p>
        <p>
          <input type="submit" value="Log In" />
        </p>
      </form>
    </div>
  );
}

Login.propTypes = {
  userIdentificationType: PropTypes.oneOf(
    Object.values(USER_IDENTIFIFICATION_TYPES)
  ),
};

Login.defaultProps = {
  userIdentificationType: USER_IDENTIFIFICATION_TYPES.USERNAME,
};

export default Login;
```

As you can see, we fix the problem of the contract, but this component is doing too much.

## God Components

Besides contract complexity, **boolean props are a symptom that the component may be a God Component**, doing too much.

### So, what to do?

If you notice that you are in the presence of a God Component, you should split the component.

In this login component example, you could create three components, for instance, to encapsulate inner details, something like:

- UsernameLogin
- EmailLogin
- PhoneNumberLogin

#### Base Login Component

```jsx
import React from "react";
import PropTypes from "prop-types";

function Login({ children }) {
  return (
    <div className="Login">
      <form>
        <p>{children}</p>
        <p>
          <label>Password:</label>
          <input type="password" />
        </p>
        <p>
          <input type="submit" value="Log In" />
        </p>
      </form>
    </div>
  );
}

Login.propTypes = {
  children: PropTypes.node,
};

export default Login;
```

#### Username Login Component

```jsx
import React from "react";

import Login from "./Login";

function UsernameLogin() {
  return (
    <Login>
      <label>Username:</label>
      <input type="text" />
    </Login>
  );
}

export default UsernameLogin;
```

#### Email Login Component

```jsx
import React from "react";

import Login from "./Login";

function EmailLogin() {
  return (
    <Login>
      <label>EmailLogin:</label>
      <input type="email" />
    </Login>
  );
}

export default EmailLogin;
```

#### Phone Login Component

```jsx
import React from "react";

import Login from "./Login";

function PhoneNumberLogin() {
  return (
    <Login>
      <label>Phone:</label>
      <input type="tel" />
    </Login>
  );
}

export default PhoneNumberLogin;
```

This way, your components will **do one thing and do it well**.

Hope that this was useful! To get more tips like this, follow me on [Twitter (@gsferreira)](https://twitter.com/gsferreira) and let's keep in touch!
