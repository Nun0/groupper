import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        userProfile: false
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
        },
        logout:(state) =>{
            state.user = null;
        },
        editProfile: (state) => {
            state.userProfile = true;
        },
        notEditProfile: (state) => {
            state.userProfile = false;
        }
    },
});

export const { login, logout, editProfile, notEditProfile } = userSlice.actions;

export const selectUser = state => state.user.user;
export const selectUserProfile = state => state.user.userProfile;

export default userSlice.reducer;