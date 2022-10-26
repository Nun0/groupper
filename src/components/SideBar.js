import React, { useContext, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import SidebarChannel from "./SidebarChannel";
import db, { signout, auth } from "../firebase";
import { onSnapshot, collection, doc, updateDoc } from "firebase/firestore";
import Logo from "./assets/logo.svg";
import "./styles/Sidebar.css";

const SideBar = ({ userContext, channelContext}) => {
    const { dispatch, user, notEditProfile, logout } = useContext(userContext);
    const { setChannelInfo, setChannels, userChannels, channels, setUserChannels, setSearchChannel, searchChannel} = useContext(channelContext);

    const channelsCollection = collection(db, "channels");
    const userChannelsCollection = collection(db, "users", user.uid, 'channels');
    
    useEffect(() => {
        const unsub = onSnapshot(channelsCollection, (snapshot) => {
            setChannels(
            snapshot.docs.map((doc) => ({
                channel: doc.data(),
                id: doc.id,
            }))
            );
        })
        return unsub;
    },[]);

    useEffect(() => {
        const unsub = onSnapshot(userChannelsCollection, (snapshot) => {
            setUserChannels(
            snapshot.docs.map((doc) => ({
                id: doc.id,
            }))
            );
        })
        return unsub;
    },[]);

    const goHome = () => {
        dispatch(
            setChannelInfo({
                channelId: null,
                channelName: null,
                description: null,
                newChannel: false,
                searchChannel: true
            })
        )
        dispatch(
            notEditProfile()
        )
    };

    async function handleSignOut(){
        const usersCollection = collection( db, 'users');
        const userRef = doc(usersCollection, user.uid);
        await updateDoc(userRef, {status: 'offline'});
            signout(auth);
            dispatch(logout());
    };

    return (
        <div className="sidebar">
        <div className="sidebar__top">
            <span>
            <img src={Logo} alt="logo" />
            </span>
            <h3 onClick={goHome}>Groupper</h3>
        </div>
        <div className="sidebar__channels">
            <div className="sidebar__channels-header">
                <div className="sidebar__header">
                    <h5>List of channels:</h5>
                </div>
            </div>
            <div className="sidebar__channelist">
            {userChannels.map(({ id }) => (
                <SidebarChannel
                key={id}
                id={id}
                />
            ))}
            </div>
        </div>
        <div className="sidebar__logout" onClick={handleSignOut}>
            <div className="sidebar__logoutInfo">
            <h4>Logout</h4>
            </div>
            <div className="sidebar__logoutIcons">
            <LogoutIcon />
            </div>
        </div>
        </div>
    );
};

export default SideBar;
