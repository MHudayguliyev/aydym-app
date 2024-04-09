import { createSlice, PayloadAction, Reducer } from "@reduxjs/toolkit";
import { InitialState } from "../types/ProfileTypes";

const initialState: InitialState = {
    isPremium: false
}

const ProfileReducer  = createSlice({
    name: 'ProfileReducer', 
    initialState: initialState, 
    reducers: {
        setProfile: (state, action) => {
            state.isPremium = action.payload
        }  
    }
})

export const {
    setProfile
} = ProfileReducer.actions
export default ProfileReducer.reducer