import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value : { username: '', token: '', positionLat: '', positionLon: ''},
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.value.username = action.payload.username;
            state.value.token = action.payload.token;
        },
        logout: (state) => {
            state.value.token = null;
            state.value.username = null;
            state.value.photo = null;
        },
        position: (state, action) => {
            state.value.positionLat = action.payload.positionLat;
            state.value.positionLon = action.payload.positionLon;
        }
    },
});

export const { login, logout, position } = userSlice.actions;
export default userSlice.reducer;