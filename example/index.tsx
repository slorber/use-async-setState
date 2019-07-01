import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useAsyncSetState, useGetState } from '../.';

const buttonStyle = {
  margin: 10,
  padding: 10,
  border: 'solid',
  borderRadius: 5,
  cursor: 'pointer',
};

const App = () => {
  const [state, setStateAsync] = useAsyncSetState({ counter: 0 });

  const getState = useGetState(state);

  const incrementAsync = async () => {
    await setStateAsync({ counter: getState().counter + 1 });
  };

  const incrementAsyncFunctional = async () => {
    await setStateAsync(s => ({ ...s, counter: s.counter + 1 }));
  };

  const repeatAsyncCall = async (
    times: number,
    asyncCall: () => Promise<void>
  ) => {
    for (let i = 0; i < times; i++) {
      await asyncCall();
    }
  };

  return (
    <div>
      <div>counter => {state.counter}</div>

      <div
        style={buttonStyle}
        onClick={() => repeatAsyncCall(5, incrementAsync)}
      >
        Increment 5 times
      </div>

      <div
        style={buttonStyle}
        onClick={() => repeatAsyncCall(5, incrementAsyncFunctional)}
      >
        Increment 5 times (functional)
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
