import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';
import { sidebarCfg } from './persist-cfg';
//reducers
import ThemeReducer from './reducers/ThemeReducer';
import SidebarReducer from './reducers/SidebarReducer';
import MediaReducer from './reducers/MediaReducer';
import ProfileReducer from './reducers/ProfileReducer';
import TopnavbarReducer from './reducers/TopnavbarReducer';

const store = configureStore({
    reducer: {
        themeReducer: ThemeReducer, 
        sidebarReducer: persistReducer(sidebarCfg, SidebarReducer)!, 
        mediaReducer: MediaReducer, 
        profileReducer: ProfileReducer, 
        topnavbarReducer: TopnavbarReducer
     },
     middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}) 
})
const persistor = persistStore(store);
export {store, persistor}
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {themeReducer: ThemeReducer }
export type AppDispatch = typeof store.dispatch;