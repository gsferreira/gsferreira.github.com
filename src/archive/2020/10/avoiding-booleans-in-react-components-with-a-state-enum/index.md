---
layout: post
tags: post
date: 2020-10-26
title: Avoiding Booleans in React Components with a State Enum
description: Did you notice that your React Components tend to have a ton of booleans** (isLoading, hasErrors, ...) that you use to control the state of your component?
featured_image: /images/archive/react/state-enum.png
---

Did you notice that **your React Components tend to have a ton of booleans** (isLoading, hasErrors, ...) **that you use to control the state of your component?**

Sure, me too. When we have a simple component this may not be a big problem. But, if there are multiple states, **it may be difficult to control the state of the component according to all the combinations of Boolean flags**.

If we step back to look into the problem, we can see that a component can only be in a given state at a given time. And to do that we already have a solution: Finite State Machines.

**Applying a Finite State Machine we can model the states where a given component can be instead of having various boolean flags.** That will result in code easier to read and to maintain. It's easier to understand the status when looking into a variable when compared to looking to boolean combinations.


## Now that you know the solution, what can you do to fix the problem?

You have two possibilities:

 1. **A Finite State Machine.** You will have the advantage of using states but also transitions. If you want to follow this approach, I highly recommend you to use a library. You can use [XState](https://github.com/davidkpiano/xstate), an excellent library for defining state machines using code.
 2. **Use a simple enumeration.** I will detail this approach in this post. I find that in most of the cases this is more than enough and it's a simpler and lightweight solution.


## How can you do it?

Fist of all, let's imagine that we have a simple component. The goal is to get display the current exchange rate between two currencies.

Our component may be in one of 3 states: 

 1. **Idle:** Waiting for instructions to do the request.
 2. **Loading:** Getting data from API.
 3. **Error:** Error retrieving data from API.
 4. **Complete:** Request to API with success.

If follow the approach of having boolean flags, we may come up with a component like the following:

```jsx
import React, { useState } from "react";
import "./styles.css";

function CurrencyExchange() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState({
    isLoading: false,
    rate: null,
    error: null
  });

  async function fetchData() {
    setResult({
      isLoading: true,
      rate: null,
      error: null
    });

    const response = await fetch(
      `https://api.exchangeratesapi.io/latest?base=${from}&symbols=${to}`
    );

    response.json().then((result) => {
      response.ok
        ? setResult({
            ...result,
            isLoading: false,
            rate: result.rates[to]
          })
        : setResult({
            ...result,
            isLoading: false,
            erro: result.error
          });
    });
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    fetchData();
  };

  if (result.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Euro:
        <input
          type="text"
          name="from"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </label>
      <label>
        To:
        <input
          type="text"
          name="to"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit" />
      {result.error != null ? (
        <h2>{result.error}</h2>
      ) : (
        <h2>Rate: {result.rate}</h2>
      )}
    </form>
  );
}

export default CurrencyExchange;
```
*[Click here to play with it on codesandbox.](https://codesandbox.io/s/dreamy-glitter-kgzod?file=/src/CurrencyExchange.jsx)*

How can we refactor it toward cleaner code?

First thing is to define an enum with the possible states.

![React State enum](/images/archive/react/state-enum.png)

Then, we can refactor the places where a boolean is in use.

```jsx
import React, { useState } from "react";
import "./styles.css";

function CurrencyExchangeRefactored() {
  const STATES = {
    IDLE: "idle",
    LOADING: "loading",
    COMPLETE: "complete",
    ERROR: "error"
  };

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [status, setStatus] = useState({
    state: STATES.IDLE,
    data: null
  });

  async function fetchData() {
    setStatus({
      state: STATES.LOADING
    });

    const response = await fetch(
      `https://api.exchangeratesapi.io/latest?base=${from}&symbols=${to}`
    );

    response.json().then((result) => {
      response.ok
        ? setStatus({
            state: STATES.LOADING.COMPLETE,
            data: result.rates[to]
          })
        : setStatus({
            state: STATES.LOADING.COMPLETE,
            data: result.error
          });
    });
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    fetchData();
  };

  if (status.state === STATES.LOADING) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Euro:
        <input
          type="text"
          name="from"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </label>
      <label>
        To:
        <input
          type="text"
          name="to"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit" />
      {status.state === STATES.IDLE ? null : (
        <h2>
          {status.state === STATES.ERROR ? (
            <span>Error: </span>
          ) : (
            <span>Rate: </span>
          )}
          {status.data}
        </h2>
      )}
    </form>
  );
}

export default CurrencyExchangeRefactored;

```
*[Click here to play with it on codesandbox.](https://codesandbox.io/s/dreamy-glitter-kgzod?file=/src/CurrencyExchangeRafactored.jsx)*

Following this approach, the component will become more readable and maintainable. Adding a new status to the component will also become easier.