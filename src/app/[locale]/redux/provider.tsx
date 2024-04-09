"use client";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import {store, persistor} from '@redux/store';

export function Providers({ children }: {children: React.ReactNode}) {
  return (
    <Provider store={store}>
      <PersistGate  persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
  
}