import SettingsIcon from "@mui/icons-material/Settings";
import { Avatar } from '@mui/material';
import React, { useContext } from 'react'
import "./styles/SideBarRight.css";

const SideBarRight = ({ userContext, channelContext}) => {
    const { dispatch, editProfile, user, notEditProfile, logout } = useContext(userContext);
    const { setChannelInfo, notNewChannel, channelId, channelName, description, imageUrl, channels, setChannels, userChannels, setUserChannels} = useContext(channelContext);
    

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
                editChannel: false,
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
        {channelName&&(
            <div className="sidebar__channel">
                <Avatar src={imageUrl} sx={{ width: 200, height: 200 }} />
                <div className="sidebar__channel-info">
                    <h5>{channelName&&channelName}</h5>
                    <div className="sidebar__channel-info__description">
                        {description&&description}
                    </div>
                </div>
            </div>
        )}

        </div>
    )
}

export default SideBarRight