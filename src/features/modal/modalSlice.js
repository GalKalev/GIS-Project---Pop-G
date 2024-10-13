import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
    isSuccessful: false,
    message: '',

}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action) => {
            state.isOpen = true;
        },
        closeModal: (state, action) => {
            state.isOpen = false;
        },
        successful: (state, action) => {
            state.isSuccessful = true;
        },
        unsuccessful: (state, action) => {
            state.isSuccessful = false;
        },
        setMessage: (state, action) => {
            state.message = action.payload;
        },
    }
})

export const { openModal, closeModal, successful, unsuccessful, setMessage } = modalSlice.actions;

export default modalSlice.reducer