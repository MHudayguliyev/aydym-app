import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: InitialState = {
    mode: '', 
}

const ThemeReducer = createSlice({
    name: "theme", 
    initialState: initialState, 
    reducers: {
        setMode: (state, action) => {
            state.mode = action.payload
        }
    }
})
export const {
    setMode
} = ThemeReducer.actions
export default ThemeReducer.reducer