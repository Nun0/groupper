import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        channelId: null,
        channelName: null,
        newChannel: false,
        description: null,
        searchingChannel: false,
    },
    reducers: {
        setChannelInfo: (state, action) => {
            state.channelId = action.payload.channelId;
            state.channelName = action.payload.channelName;
            state.newChannel = action.payload.newChannel;
            state.description = action.payload.description;
            state.searchingChannel = action.payload.searchChannel;
        },
        newChannel: (state) => {
            state.newChannel = true;
            state.searchingChannel = false;
            state.channelId = null;
            state.channelName = null;
            state.description = null;
        },
        notNewChannel: (state) => {
            state.newChannel = false;
        },
        searchingChannel: (state) => {
            state.searchingChannel = true;
            state.newChannel = false;
            state.channelId = null;
            state.channelName = null;
            state.description = null;
        }
    },
});

export const { setChannelInfo, newChannel, notNewChannel, searchingChannel } = appSlice.actions;

export const selectChannelId = (state) => state.app.channelId;
export const selectChannelName = (state) => state.app.channelName;
export const selectnewChannel = (state) => state.app.newChannel;
export const selectDescription = (state) => state.app.description;
export const selectSearchingChannel = (state) => state.app.searchingChannel;

export default appSlice.reducer;