import storage from 'redux-persist/lib/storage';
export const sidebarCfg = {
    key: 'sidebar', storage, 
    whitelist: ['sidebarFolded']
}