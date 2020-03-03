# use-async-setState

[![NPM](https://img.shields.io/npm/dm/use-async-setstate.svg)](https://www.npmjs.com/package/use-async-setstate)
[![Build Status](https://travis-ci.com/slorber/use-async-setState.svg?branch=master)](https://travis-ci.com/slorber/use-async-setState)


`setState` returned by `useState` does not take a callback anymore, but this is sometimes convenient to chain `setState` calls one after the other.

```ts
import { useAsyncSetState } from "use-async-setState";

const Comp = () => {
  const [state,setStateAsync] = useAsyncSetState({ counter: 0 });
  
  const incrementAsync = async () => {
    await setStateAsync(s => ({...s, counter: s.counter+1}));
    await setStateAsync(s => ({...s, counter: s.counter+1}));
    await setStateAsync(s => ({...s, counter: s.counter+1}));
  }
  
  return <div>...</div> 
}   
```

# Reading your own writes in async closures

**Warning: this applies if you use closures + `setState` in the non-functional way (`setState(newState)` instead of `setState(s => s)`)**. You'd rather always use the functional form when possible.


```ts
import { useAsyncSetState, useGetState } from "use-async-setState";

const Comp = () => {
  const [state,setStateAsync] = useAsyncSetState({ counter: 0 });
  
  const incrementTwiceAndSubmit = async () => {
    await setStateAsync({...state, counter: state.counter + 1});
    await setStateAsync({...state, counter: state.counter + 1});
    await setStateAsync({...state, counter: state.counter + 1});
  }
  
  return <div>...</div> 
}   
```

The following won't work fine. In this case, the `state` variable has been captured by the closure. 

It's value is 0 and you are basically doing `await setStateAsync({...state: counter: 0 + 1});` 3 times: at the end the counter value is 1.

If you need to use the non-functional `setState` (which I don't recommend for async stuff), you can use the `useGetState` helper to get access to the latest state inside your closure:

```ts
import { useAsyncSetState, useGetState } from "use-async-setState";

const Comp = () => {
  const [state,setStateAsync] = useAsyncSetState({ counter: 0 });
  const getState = useGetState(state);
  
  const incrementTwiceAndSubmit = async () => {
    await setStateAsync({...getState(), counter: getState().counter + 1});
    await setStateAsync({...getState(), counter: getState().counter + 1});
    await setStateAsync({...getState(), counter: getState().counter + 1});
  }
  
  return <div>...</div> 
}   
```

Actually, it's exactly the same as when using a classes: you would read the state by using `this.state`, where `this` acts somehow as a mutable state ref to access the latest state.


# License

MIT

# Hire a freelance expert

Looking for a React/ReactNative freelance expert with more than 5 years production experience?
Contact me from my [website](https://sebastienlorber.com/) or with [Twitter](https://twitter.com/sebastienlorber).
