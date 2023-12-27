import { createSlice } from '@reduxjs/toolkit'


export const initialState = {
    show: false,
    toastTitle: '',
    toastTxt: '',
    bg: ''
}

export const toastSlice = createSlice({
    name: 'toastService',
    initialState: initialState,
    reducers: {
        setShow(state, action) {
            return {
                ...state,
                show: action.payload
            }
        },
        setToast(state, action) {
            return {
                ...state,
                ...action.payload
            }
        }
    }
})


export const {
    setShow,
    setToast
} = toastSlice.actions


export default toastSlice.reducer