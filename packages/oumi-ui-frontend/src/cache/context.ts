/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { createContext, useContext } from 'react';
import { dropByCacheKey, getCachingKeys } from 'react-router-cache-route';

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
  activeIndex: number;
}

interface IStore {
  state: IState;
  dispatch: IDispatch;
}

const state: IState = {
  activeIndex: 0,
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
  LISTEN_CACHE: 'listen_cache',
  ADD_CACHE: 'add_cache',
  REMOVE_CACHE: 'remove_cache',
  ACTIVE_INDEX: 'active_index',
  ACTIVE_KEY: 'active_key'
};

// eslint-disable-next-line @typescript-eslint/no-shadow
export const CacheReducer = (state: IState, action: IAction): IState => {
  const value: any = action.payload;
  const { type } = action;

  function add(val: any) {
    const findIndex = state.cacheList.findIndex((v) => v.pathname === val.pathname);
    if (findIndex === -1) {
      state.cacheList.push(val);
    }
    return { ...state, activeIndex: state.cacheList.length - 1 };
  }

  function remove(options: { value: string; callback: (params: { isCurrent: boolean; prevItem: any }) => void }) {
    let { activeIndex } = state;
    const val = options.value;
    let isCurrent = false;
    let prevItem = null;
    if (typeof val === 'string') {
      const findIndex = state.cacheList.findIndex((v) => v.pathname === val);
      if (findIndex === state.activeIndex) {
        if (findIndex === 0) {
          activeIndex = findIndex + 1;
        } else {
          activeIndex = findIndex - 1;
        }
        isCurrent = true;
        prevItem = state.cacheList[activeIndex];
      }
      state.cacheList.splice(findIndex, 1);
      if (typeof options.callback === 'function') {
        options.callback({
          isCurrent,
          prevItem
        });
      }
    }
    dropByCacheKey(val);
    return { ...state, activeIndex };
  }

  switch (type) {
    case CacheType.ADD_CACHE: {
      return add(value);
    }
    case CacheType.LISTEN_CACHE: {
      const findIndex = state.cacheList.findIndex((v) => v.pathname === value.pathname);
      if (findIndex === -1) {
        return add(value);
      }
      return { ...state, activeIndex: findIndex };
    }
    case CacheType.REMOVE_CACHE: {
      if (state.cacheList.length <= 1) {
        return state;
      }
      return remove(value);
    }
    case CacheType.ACTIVE_INDEX: {
      return { ...state, activeIndex: value };
    }
    case CacheType.ACTIVE_KEY: {
      if (typeof value === 'string') {
        const findIndex = state.cacheList.findIndex((v) => v.pathname === value);
        return { ...state, activeIndex: findIndex };
      }
      return { ...state, activeIndex: value };
    }
    default:
      return state;
  }
};
