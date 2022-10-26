import React, { useContext, useCallback, useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import SidebarChannel from "./SidebarChannel";
import db, { signout, auth } from "../firebase";
import { onSnapshot, collection, doc, updateDoc, getDoc } from "firebase/firestore";
import Logo from "./assets/logo.svg";
import "./styles/Sidebar.css";
import SidebarUser from "./SidebarUser";

const SideBar = ({ userContext, channelContext}) => {
    const { usersList, setUsersList, dispatch, user, notEditProfile, logout, setIsAdmin, isAdmin } = useContext(userContext);
    const { setChannelInfo, setChannels, userChannels, setUserChannels } = useContext(channelContext);

    const channelsCollection = collection(db, "channels");
    const usersCollection = collection(db, "users");
    const userChannelsCollection = collection(db, "users", user.uid, 'channels');

    async function handleSignOut(){
        const usersCollection = collection( db, 'users');
        const userRef = doc(usersCollection, user.uid);
        await updateDoc(userRef, {status: 'offline'});
            signout(auth);
            dispatch(logout());
    };
    
    const fetchIsAdmin = useCallback(async () => {
        try{
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            if(userData.role === 'admin'){setIsAdmin(true)}
            if(userData.blacklisted === true ){ handleSignOut(); console.log('logout'); console.log(userData.blacklisted);}
        } catch(e){
            console.log(e);
        }
    },[])

    useEffect(() => {
        fetchIsAdmin()
        .catch(console.error)
    },[fetchIsAdmin]);
    
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
        const unsub = onSnapshot(usersCollection, (snapshot) => {
            setUsersList(
            snapshot.docs.map((doc) => ({
                user: doc.data(),
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
                editChannel: false,
                searchChannel: true
            })
        )
        dispatch(
            notEditProfile()
        )
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
                    <h5>My Groups:</h5>
                </div>
            </div>
            <div className="sidebar__channelist">
            {userChannels.map(({ id }) => (
                <SidebarChannel
                key={id}
                id={id}
                isAdmin={isAdmin}
                />
            ))}
            </div>
            {isAdmin&&(
                <div className="text-white ms-2 mt-4 h5">
                Users:
                </div>
            )}
            
            <div className="sidebar__channelist">
            {isAdmin&&usersList.map(({ id, user}) => (
                <SidebarUser
                key={id}
                id={id}
                user={user}
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
