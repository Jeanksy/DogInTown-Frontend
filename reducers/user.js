import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value : { username: '', token: '', positionLat: '', positionLon: '', postCode: ''},
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.value.username = action.payload.username;
            state.value.token = action.payload.token;
            state.value.postCode = action.payload.postCode;
        },
        logout: (state) => {
            state.value.token = '';
            state.value.username = '';
            state.value.postCode = '';
            state.value.positionLat = '';
            state.value.positionLon = '';
        },
        position: (state, action) => {
            state.value.positionLat = action.payload.positionLat;
            state.value.positionLon = action.payload.positionLon;
        }
    },
});

export const { login, logout, position } = userSlice.actions;
export default userSlice.reducer;