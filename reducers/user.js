import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value : { username: null, token: null},
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        upDateUser: (state, action) => {
        state.value.username = action.payload.username;
        state.value.token = action.payload.token;
        },
    },
});

export const { upDateUser } = userSlice.actions;
export default userSlice.reducer;

