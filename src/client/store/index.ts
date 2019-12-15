import React, { createContext, useContext, useEffect, useReducer } from "react";
import getInitialState from "./initialState";
import reducer from "./reducer";

interface Store {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const StoreCtx = createContext<Store>(undefined!);

export const StoreProvider = StoreCtx.Provider;

export function createStore(): Store {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  useEffect(() => {
    saveToSessionStorageIfExists("username", state.user.name);
    saveToSessionStorageIfExists("userId", state.user.id);
  }, [state.user.name, state.user.id]);

  return { state, dispatch };
}

export function useStore(): Store {
  return useContext(StoreCtx);
}

function saveToSessionStorageIfExists(
  key: string,
  value: string | undefined,
): void {
  if (!!value && value !== "") {
    window.sessionStorage.setItem(key, value);
  }
}
