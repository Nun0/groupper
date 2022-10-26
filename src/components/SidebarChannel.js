import { collection, deleteDoc, doc, getDoc, getDocs } from '@firebase/firestore'
import React, { useCallback, useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {  notNewChannel, setChannelInfo } from '../features/appSlice'
import { notEditProfile, selectUser } from '../features/userSlice'
import db from '../firebase'
import './styles/SidebarChannel.css'
import DeleteChannelButton from './DeleteChannelButton'

const SidebarChannel = ({ id , isAdmin}) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const [data , setdata ] = useState({});
    const [isOwner, setIsOwner] = useState(false);

    const fetchData = useCallback(async () => {
        try{
            const channelRef = doc(db, 'channels', id);
            const channelSnap = await getDoc(channelRef);
            const channelData = channelSnap.data();
            setdata(channelData);
            const roleRef = doc(db, 'users', user.uid, 'channels', id) 
            const roleSnap = await getDoc(roleRef);
            const roleData = roleSnap.data();
            if(roleData.role === 'owner'){setIsOwner(true)}
        } catch(e){
            console.log(e);
        }
    },[])
    
    useEffect(() => {
        fetchData()
        .catch(console.error)
    },[fetchData]);

    const deleteChannel = async () => {
        const channelRef = doc(db, 'channels', id);
        await deleteDoc(channelRef).then().catch(err => console.log(err));
        
        const userCol = await getDocs(collection(db,'users'));
        userCol.forEach(async (user) =>{
            const userChannelRef = doc(db, 'users', user.id, 'channels', id)
            await deleteDoc(userChannelRef).then().catch(err => console.log(err));
        })
        dispatch(
            setChannelInfo({
                channelId: null,
                channelName: null,
                description: null,
                imageUrl: null
            })
        )
    }

    const handleClickChannel = () => {
        dispatch(
            setChannelInfo({
            channelId: id,
            channelName: data.channelName,
            description: data.description,
            imageUrl: data.imageUrl,
            searchingChannel: false
            }),
        );
        dispatch(notEditProfile());
        dispatch(notNewChannel());
    }

    return (
        <div className="sidebar-channel d-flex align-items-center">
            <span className="channel-title" onClick={handleClickChannel}>
                <span className='sidebar-channel__hash'>{'{ }'}</span>
                {data.channelName}
            </span>
            <DeleteChannelButton isOwner={isOwner} isAdmin={isAdmin} deleteChannel={deleteChannel}/>
        </div>
    )
}

export default SidebarChannel
