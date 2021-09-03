import React, { createContext, useContext } from 'react';
import type { IRequestData, IRequestPostItem } from '../type.d';

interface Context {
  responseData: any;
  requestData: IRequestData;
  setRequestData: (val: IRequestData) => void;
  requestPostData: IRequestPostItem[];
  setRequestPostData: (val: IRequestPostItem[]) => void;
}

const context = {
  responseData: null,
  requestData: {
    query: [],
    bodyFormData: [],
    bodyJSON: [],
    header: [],
    cookie: []
  },
  setRequestData: (val: IRequestData) => undefined,
  requestPostData: [],
  setRequestPostData: (val: IRequestPostItem[]) => undefined
};

export const DegContext = createContext<Context>(context);

export const useDegContext = () => useContext<Context>(DegContext);
