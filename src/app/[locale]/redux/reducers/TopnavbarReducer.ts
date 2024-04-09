import { createSlice } from '@reduxjs/toolkit';
import { InitialState } from '../types/TopNavbarTypes';

const initialState: InitialState = {
    songId: -1, 
    openPlaylistModal: false, 
    editMode: false, 
    valueToEdit: ""
}


const TopnavbarReducer = createSlice({
    name: 'TopnavbarReducer', 
    initialState: initialState, 
    reducers: {
        togglePlaylistModal: (state, action) => {
            state.openPlaylistModal = action.payload.state
            state.songId = action.payload.id
        }, 
        openEditMode: (state, action) => {
            state.editMode = true
            state.openPlaylistModal = true
            state.songId = action.payload.id
            state.valueToEdit = action.payload.valueToEdit
        },
        closePlaylistModal: (state) => {
            state.songId = -1
            state.valueToEdit = ""
            state.openPlaylistModal = false
            state.editMode = false
        }
    }   
})

export const {
    togglePlaylistModal, 
    openEditMode, 
    closePlaylistModal
} = TopnavbarReducer.actions
export default TopnavbarReducer.reducer