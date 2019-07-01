import { renderHook, act } from '@testing-library/react-hooks';
import { useAsyncSetState } from '../src/index';
import { useState } from 'react';

type TestState = {
  counter: number;
  label: string;
};

test('should increment counter', async () => {
  const useStateHook = renderHook(() =>
    useState<TestState>({ label: 'hey', counter: 0 })
  );
  const getState = () => useStateHook.result.current[0];
  const getSetState = () => useStateHook.result.current[1];

  const useAsyncSetStateHook = renderHook(() =>
    useAsyncSetState(getState(), getSetState())
  );
  const getSetStateAsync = () => useAsyncSetStateHook.result.current;

  const assertCounter = (expectedValue: number) =>
    expect(getState().counter).toBe(expectedValue);

  const incrementAsync = async () => {
    const setStateAsync = getSetStateAsync();
    const promise = await act(() =>
      setStateAsync({
        ...getState(),
        counter: getState().counter + 1,
      }) as any
    );
    // Wait for state update
    await act(() => useStateHook.waitForNextUpdate() as any);
    // trigger re-render of useAsyncSetState hook
    await act(() => useAsyncSetStateHook.rerender() as any);
    // Now the promise should be resolved
    await promise;
  };


  assertCounter(0);
  await incrementAsync();
  assertCounter(1);
  await incrementAsync();
  assertCounter(2);
  await incrementAsync();
  assertCounter(3);

});
