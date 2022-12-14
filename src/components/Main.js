import React, { useState } from 'react'
import Chat from './Chat'
import SideBar from './SideBar'
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, selectUserProfile, notEditProfile, logout, editProfile } from '../features/userSlice';
import { selectChannelId, selectChannelName, selectDescription, selectnewChannel, setChannelInfo, notNewChannel, selectSearchingChannel, selectImageUrl } from '../features/appSlice';
import SideBarRight from './SideBarRight';

const UserContext = React.createContext();
const ChannelContext = React.createContext();

const Main = () => {
    const dispatch = useDispatch();
    const editingProfile = useSelector(selectUserProfile);
    const user = useSelector(selectUser);

    const channelId = useSelector(selectChannelId);
    const channelName = useSelector(selectChannelName);
    const description = useSelector(selectDescription);
    const newChannel = useSelector(selectnewChannel);
    const editChannel = useSelector(selectnewChannel);
    const imageUrl = useSelector(selectImageUrl);
    const isSearchChannel = useSelector(selectSearchingChannel);
    const [channels, setChannels] = useState([]);
    const [userChannels, setUserChannels] = useState([]);
    const [searchChannel, setSearchChannel] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [usersList, setUsersList] = useState([]);

    return (
        <ChannelContext.Provider value={{ imageUrl, channelId, searchChannel, setSearchChannel, isSearchChannel, editChannel, channelName, description, newChannel, setChannelInfo, notNewChannel, searchTerm, setSearchTerm, channels, setChannels, userChannels, setUserChannels}}>
            <UserContext.Provider value={{ usersList, setUsersList, isAdmin, setIsAdmin, dispatch, editProfile, user, notEditProfile, logout, editingProfile}}>
                <SideBar userContext={UserContext} channelContext={ChannelContext}/>
                <Chat userContext={UserContext} channelContext={ChannelContext}/>
                <SideBarRight userContext={UserContext} channelContext={ChannelContext}/>
            </UserContext.Provider>
        </ChannelContext.Provider>
        
    )
}

export default Main