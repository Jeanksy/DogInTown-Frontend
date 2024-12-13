import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value : { username: '', token: '', photo: '', photoChien:''},
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.value.username = action.payload.username;
            state.value.token = action.payload.token;
        },
        addPhoto: (state, action) => {
            state.value.photo = action.payload.photo;
        },
        addPhotoChien: (state, action) => {
            state.value.photoChien = action.payload.photo;
        },
        logout: (state) => {
            state.value.token = null;
            state.value.username = null;
            state.value.photo = null;
        },
    },
});

export const { login, logout, addPhoto, addPhotoChien } = userSlice.actions;
export default userSlice.reducer;