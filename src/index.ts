import React, { useCallback, useEffect, useRef, useState } from 'react';

export type SyncSetState<S> = (stateUpdate: React.SetStateAction<S>) => void;
export type AsyncSetState<S> = (
  stateUpdate: React.SetStateAction<S>
) => Promise<S>;

export const useAsyncSetStateFunction = <S>(
  state: S,
  setState: SyncSetState<S>
): AsyncSetState<S> => {
  // hold resolution function for all setState calls still unresolved
  const resolvers = useRef<((state: S) => void)[]>([]);

  // ensure resolvers are called once state updates have been applied
  useEffect(() => {
    resolvers.current.forEach(resolve => resolve(state));
    resolvers.current = [];
  }, [state]);

  // make setState return a promise
  return useCallback(
    (stateUpdate: React.SetStateAction<S>) => {
      return new Promise<S>((resolve, reject) => {
        setState(stateBefore => {
          try {
            const stateAfter =
              stateUpdate instanceof Function
                ? stateUpdate(stateBefore)
                : stateUpdate;

            // If state does not change, we must resolve the promise because react won't re-render and effect will not resolve
            if (stateAfter === stateBefore) {
              resolve(stateAfter);
            }
            // Else we queue resolution until next state change
            else {
              resolvers.current.push(resolve);
            }
            return stateAfter;
          } catch (e) {
            reject(e);
            throw e;
          }
        });
      });
    },
    [setState]
  );
};


export const useAsyncSetState = <S>(
  initialState: S,
): [S,AsyncSetState<S>] => {
  const [state, setState] = useState(initialState);
  const setStateAsync = useAsyncSetStateFunction(state,setState);
  return [state, setStateAsync];
};
