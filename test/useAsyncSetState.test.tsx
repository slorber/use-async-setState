import { renderHook, act } from '@testing-library/react-hooks';
import { useAsyncSetState } from '../src/index';

type TestState = {
  counter: number;
  label: string;
};

test('should increment counter', async () => {
  const useAsyncSetStateHook = renderHook(() =>
    useAsyncSetState<TestState>({ label: 'hey', counter: 0 })
  );
  const getState = () => useAsyncSetStateHook.result.current[0];
  const setStateAsync = useAsyncSetStateHook.result.current[1];


  const assertCounter = (expectedValue: number) =>
    expect(getState().counter).toBe(expectedValue);

  const incrementAsync = async () => {
    const promise = await act(() =>
      setStateAsync({
        ...getState(),
        counter: getState().counter + 1,
      }) as any
    );
    // Wait for state update
    await act(() => useAsyncSetStateHook.waitForNextUpdate() as any);
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
