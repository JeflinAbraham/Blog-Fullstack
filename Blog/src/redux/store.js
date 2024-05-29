import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

//why redux-persist? when u refresh the page, the values of redux store veriables should still persist.
//combineReducers: Combines multiple reducers into a single root reducer.
const rootReducer = combineReducers({
  user: userReducer,
});

//refer docs.
const persistConfig = {
  key: 'root',
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});


export const persistor = persistStore(store);