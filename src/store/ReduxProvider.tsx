'use client';
import { store } from '@/store/rtk.store';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';

interface ReduxProviderProps {
  children: ReactNode;
}

const ReduxProvider = ({ children }: ReduxProviderProps) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
