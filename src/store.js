import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // This uses localStorage by default
import { combineReducers } from 'redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import modalReducer from './features/modal/modalSlice';
import userReducer from './features/user/userSlice';
import favoritesReducer from './features/favorites/favoritesSlice'

// Configuration for redux-persist
const persistConfig = {
    key: 'root', // The key for your root reducer
    storage, // Use localStorage to persist state
};

// Combine your reducers
const rootReducer = combineReducers({
    modal: modalReducer,
    user: userReducer,
    favorites: favoritesReducer
    // Add other reducers here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
});

const persistor = persistStore(store);

export { store, persistor };
