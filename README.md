# use-async-setState

[![NPM](https://img.shields.io/npm/dm/use-async-setState.svg)](https://www.npmjs.com/package/use-async-setState)
[![Build Status](https://travis-ci.com/slorber/use-async-setState.svg?branch=master)](https://travis-ci.com/slorber/use-async-setState)


`setState` returned by `useState` does not take a callback anymore, but this is sometimes convenient to chain setState calls one after the other.

```ts
import { useAsyncSetState } from "use-async-setState";

const Comp = () => {
  const [state,setStateAsync] = useAsyncSetState({ counter: 0 });
  
  const incrementAsync = async () => {
    await setStateAsync(s => ({...s: counter: s.counter+1}));
  }
  
  return <div>...</div> 
}   
```

# Reading your own writes in async closures

Even if your component has updated after promise resolution, the async closure being currently executed remains the same and variables captured in it remains updated.

If your async closure need access to the current state, you can use `useGetState` to return you the latest state.

```ts
import { useAsyncSetState, useGetState } from "use-async-setState";

const Comp = () => {
  const [state,setStateAsync] = useAsyncSetState({ counter: 0 });
  const getState = useGetState(state);
  
  const incrementTwiceAndSubmit = async () => {
    await setStateAsync({...getState(): counter: getState().counter + 1});
    await setStateAsync({...getState(): counter: getState().counter + 1});
    await submitState(getState());
  }
  
  return <div>...</div> 
}   
```

It's exactly the same as when using a classes: you would read the state by using `this.state`, where `this` is acts somehow as a mutable state ref.


# License

MIT

# Hire a freelance expert

Looking for a React/ReactNative freelance expert with more than 5 years production experience?
Contact me from my [website](https://sebastienlorber.com/) or with [Twitter](https://twitter.com/sebastienlorber).
