import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        channelId: null,
        channelName: null,
        description: null,
        imageUrl: null,
        newChannel: false,
        editChannel: false,
        searchingChannel: false,
    },
    reducers: {
        setChannelInfo: (state, action) => {
            state.channelId = action.payload.channelId;
            state.channelName = action.payload.channelName;
            state.description = action.payload.description;
            state.imageUrl = action.payload.imageUrl;
            state.newChannel = action.payload.newChannel;
            state.editChannel = action.payload.editChannel;
            state.searchingChannel = action.payload.searchChannel;
        },
        newChannel: (state) => {
            state.newChannel = true;
            state.editChannel = false;
            state.searchingChannel = false;
            state.channelId = null;
            state.channelName = null;
            state.description = null;
            state.imageUrl = null;
        },
        notNewChannel: (state) => {
            state.newChannel = false;
        },
        searchingChannel: (state) => {
            state.searchingChannel = true;
            state.newChannel = false;
            state.editChannel = false;
            state.channelId = null;
            state.channelName = null;
            state.description = null;
            state.imageUrl = null;
        },
        editingChannel: (state) => {
            state.newChannel = null;
            state.editChannel = true;
            state.searchingChannel = null;
        }
    },
});

export const { setChannelInfo, newChannel, notNewChannel, searchingChannel, editingChannel } = appSlice.actions;

export const selectChannelId = (state) => state.app.channelId;
export const selectChannelName = (state) => state.app.channelName;
export const selectnewChannel = (state) => state.app.newChannel;
export const selectEditChannel = (state) => state.app.editChannel;
export const selectDescription = (state) => state.app.description;
export const selectSearchingChannel = (state) => state.app.searchingChannel;
export const selectImageUrl = (state) => state.app.imageUrl;

export default appSlice.reducer;