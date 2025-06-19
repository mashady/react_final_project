"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
// import LoadingScreen from "@/components/LoadingScreen";

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>loading..</div>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
