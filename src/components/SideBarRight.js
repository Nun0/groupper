import SettingsIcon from "@mui/icons-material/Settings";
import { Avatar } from '@mui/material';
import React, { useContext } from 'react'
import { setChannelInfo } from '../features/appSlice';
import { editProfile } from '../features/userSlice';
import "./styles/SideBarRight.css";

const SideBarRight = ({ userContext, channelContext}) => {
    const { dispatch, editProfile, user, notEditProfile, logout } = useContext(userContext);
    const { setChannelInfo, notNewChannel, channels, setChannels, userChannels, setUserChannels} = useContext(channelContext);

    const handleEditProfile = () => {
        dispatch(
            editProfile()
        )
        dispatch(
            setChannelInfo({
                channelId: null,
                channelName: null,
                description: null,
                newChannel: false,
                searchChannel: false,
            }),
        )
    }

    return (
        <div className="sidebar">
            <div className="sidebar__profile">
            <Avatar src={user.photo} referrerPolicy="no-referrer" />
            <div className="sidebar__profileInfo">
            <h5 onClick={handleEditProfile}>{user.displayName}</h5>
            <p>#{user.uid.substring(0, 7)}</p>
            </div>
            <div className="sidebar__profileIcons">
            <SettingsIcon onClick={handleEditProfile}/>
            </div>
        </div>
        <div className="sidebar__channels">
            <div className="sidebar__channels-header">
                <div className="sidebar__header">
                    <h5>List of channels:</h5>
                </div>
            </div>
            <div className="sidebar__channelist">
            </div>
        </div>
        </div>
    )
}

export default SideBarRight