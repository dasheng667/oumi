/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { createContext, useContext } from 'react';

interface CacheList {
  hash: string;
  key: string;
  pathname: string;
  search: string;
  state: any;
}

interface IAction {
  type: string;
  payload?: any;
}

type IDispatch = React.Dispatch<IAction>;

interface IState {
  cacheList: CacheList[];
}

interface IStore {
  state: IState;
  dispatch: IDispatch;
}

const state: IState = {
  cacheList: []
};

const cacheStore: IStore = {
  state,
  dispatch() {}
};

export const CacheContext = createContext(cacheStore);

export const useCacheContext = () => {
  return useContext(CacheContext);
};

export const CacheType = {
  ADD_CACHE: 'add_cache'
};

// eslint-disable-next-line @typescript-eslint/no-shadow
export const CacheReducer = (state: IState, action: IAction): IState => {
  console.log('state:', state);
  console.log('action.payload:', action.payload);

  const value: any = action.payload;
  const { type } = action;

  switch (type) {
    case CacheType.ADD_CACHE: {
      const findIndex = state.cacheList.findIndex((v) => v.pathname === value.pathname);
      if (findIndex === -1) {
        state.cacheList.push(value);
      }
      return { ...state };
    }
    default:
      return state;
  }
};
