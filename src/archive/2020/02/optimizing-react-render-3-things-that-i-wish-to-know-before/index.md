---
layout: post
tags: post
date: 2020-02-26
title: Optimizing React Render - 3 things that I wish to know before
description: Optimize React rendering performance - avoid object references, prevent unnecessary re-renders, and improve component efficiency.
category: React
featured_image: /images/optimizing-react-render-3-things-that-i-wish-to-know-before.png
---

![Optimizing React Render - 3 things that I wish to know before](/images/optimizing-react-render-3-things-that-i-wish-to-know-before.png)

My experience with [React](https://reactjs.org/) has been awesome so far. My feeling is that I just needed to understand the basic concepts to be productive with React. The problem is that there are a few advanced concepts that I was missing.

Recently, the lack of knowledge manifested itself as performance issues. To fix them I needed to learn in the hard way. So, I'm sharing this here because if I can prevent you from suffering from it, I would be glad.

I observed that the components of my application were rendering too many times, even when I did not need them to re-render. The following 3 recommendations are the main reasons for that to happen.

---

## 💡 1. Don't pass props with an object by reference

**If you invoke a component and set a prop with a given object, the object will be passing by reference.** This can cause all kind of problems. I was facing two distinct problems:

- Despite I was lifting the state up, the child components have access to the same instance of the state.
- When passing props by reference, you can receive the same object in the prevProps and nextProps for a componentShouldUpdate event. That will cause you problems. You want to compare those props to know what has been changed, but you are looking at the exact same object.

### ✅ What to do?

Use the spread operator. If you have a complex data structure, with multi-level deepness, use a tool like [Lodash cloneDeep](https://lodash.com/docs/#cloneDeep).

---

## 💡 2. Only pass properties needed to the component

**Make sure that you don't provide information that isn't needed to the child components. Try to only pass simple props with primitive types or functions.** If you pass a complex object and the child object only needs part of it, React will need to re-render the component. React will re-render every time that the props or the state change.

### ✅ What to do?

Review your components and question all those props where the prop type is Object or Any.

---

## 💡 3. React Memo or Pure Components

Memo and Pure Components are an excellent way of improving performance. But, unless you are using them in the correct scenario you will not see the benefits. **If you are providing a complex object** (like explained in recommendation 2) **Memo and Pure Components will not work as you expect.**

To understand that, you need to know that a Pure Component is different from a Component. Pure Components implement the _"shouldComponentUpdate"_ with a shallow prop and state comparison.

React documentation ([see here](https://reactjs.org/docs/react-api.html#reactpurecomponent)):

_"`React.PureComponent’s` `shouldComponentUpdate()` only shallowly compares the objects. If these contain complex data structures, it may produce false-negatives for deeper differences."_

### ✅ What to do?

Try to follow the recommendation 2. If you need to have a complex data structure, use a Component and implement the _"shouldComponentUpdate"_ instead.

You can also take a look into react-fast-compare to help you out comparing complex data.

---

To conclude, try to use primitive data as Props and use Pure Components or Memo when you can.

If you can't, be sure that you clone the data and implement the _"shouldComponentUpdate"_ by yourself.

I hope that this helps you.
