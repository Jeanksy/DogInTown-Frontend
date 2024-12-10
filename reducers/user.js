import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value : { username: null, token: null},
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        Login: (state, action) => {
        state.value.username = action.payload.username;
        state.value.token = action.payload.token;
        },
        logout: (state) => {
            state.value.token = null;
            state.value.username = null;
        },
    },
});

export const { Login, logout } = userSlice.actions;
export default userSlice.reducer;

