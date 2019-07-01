import { renderHook, act } from '@testing-library/react-hooks';
import { useAsyncSetState } from '../src/index';

type TestState = {
  counter: number;
  label: string;
};

test('should increment counter', async () => {
  const { result } = renderHook(() =>
    useAsyncSetState<TestState>({ label: 'hey', counter: 0 })
  );

  const getState = () => result.current[0];
  const setStateAsync = result.current[1];

  const assertCounter = (expectedValue: number) =>
    expect(getState().counter).toBe(expectedValue);

  const incrementAsync = async () => {
    let promise: any;
    act(() => {
      promise = setStateAsync({
        ...getState(),
        counter: getState().counter + 1,
      });
    });
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
