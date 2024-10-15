import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // This uses localStorage by default
import { combineReducers } from 'redux';
import modalReducer from './features/modal/modalSlice';
import userReducer from './features/user/userSlice';
import favoritesReducer from './features/favorites/favoritesSlice';
import { createTransform } from 'redux-persist';

// This transform will reset the `isLoading` field to false during rehydration
const resetLoadingTransform = createTransform(
    (inboundState, key) => inboundState,
    (outboundState, key) => {
        if (outboundState.isLoading !== undefined) {
            return { ...outboundState, isLoading: false };
        }
        return outboundState;
    },
    { whitelist: [ 'user', 'favorites'] }  // Specify relevant slices
);

// Configuration for redux-persist
const persistConfig = {
    key: 'root',  // The key for your root reducer
    storage,  // Use localStorage to persist state
    transforms: [resetLoadingTransform],  // Add the resetLoadingTransform here
};

// Combine your reducers
const rootReducer = combineReducers({
    modal: modalReducer,
    user: userReducer,
    favorites: favoritesReducer,
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
