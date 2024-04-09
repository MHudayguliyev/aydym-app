import { InitialState } from './../types/SidebarReducer';
import { createSlice } from '@reduxjs/toolkit';

const initialState: InitialState = {
    sidebarFolded: false, 
    showHiddenSidebar: false
}

const SidebarReducer = createSlice({
    name: 'sidebar', 
    initialState: initialState, 
    reducers: {
        toggleSidebar: (state, action) => {
            state.sidebarFolded = action.payload
        }, 
        setShowHiddenSidebar: (state, action) => {
            state.showHiddenSidebar = action.payload
        }
    }
})

export const {
    toggleSidebar, 
    setShowHiddenSidebar
} = SidebarReducer.actions
export default SidebarReducer.reducer