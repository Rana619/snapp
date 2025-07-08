import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import configReducer from "./slices/configSlice"
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import type { RootState } from "@/types/store.type";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'config']
};

const rootReducer = combineReducers({
    user: userReducer,
    config: configReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export default store;

export type { RootState };
export type AppDispatch = typeof store.dispatch;