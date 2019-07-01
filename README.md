# use-async-setState

[![NPM](https://img.shields.io/npm/dm/use-async-setState.svg)](https://www.npmjs.com/package/use-async-setState)
[![Build Status](https://travis-ci.com/slorber/use-async-setState.svg?branch=master)](https://travis-ci.com/slorber/use-async-setState)


`setState` returned by `useState` does not take a callback anymore, but this is sometimes convenient to chain setState calls one after the other.

``` 
import { useAsyncSetState } from "use-async-setState";

const Comp = () => {
  const [state,setStateAsync] = useAsyncSetState({ counter: 0 });
  
  const incrementAsync = async () => {
    await setStateAsync(s => ({...s: counter: s.counter+1}));
    await doSomethingElse();
  }
  
  return <div>...</div> 
}   
```

### Warning

Even if your component has updated after promise resolution, the async closure being currently executed remains the same and variables captured in it remains updated.

If your async closure need access to current state, you'd rather use a `getState()` getter to always read fresh state.


```ts
const useGetState = (state) => {
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });
  return useCallback(() => stateRef.current, [stateRef]);
};
```

This way you are sure to read your writes

```
  const incrementTwice = async () => {
    await setStateAsync({...getState(): counter: getState() + 1});
    await setStateAsync({...getState(): counter: getState() + 1});
    await submitState(getState());
  }
```


# License

MIT

# Hire a freelance expert

Looking for a React/ReactNative freelance expert with more than 5 years production experience?
Contact me from my [website](https://sebastienlorber.com/) or with [Twitter](https://twitter.com/sebastienlorber).
