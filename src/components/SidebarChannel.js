import { doc, getDoc } from '@firebase/firestore'
import React, { useCallback, useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { notNewChannel, setChannelInfo } from '../features/appSlice'
import { notEditProfile } from '../features/userSlice'
import db from '../firebase'
import './styles/SidebarChannel.css'

const SidebarChannel = ({ id }) => {
    const dispatch = useDispatch();

    const [data , setdata ] = useState({});

    const fetchData = useCallback(async () => {
        try{
            const channelRef = doc(db, 'channels', id);
            const channelSnap = await getDoc(channelRef)
            const channelData = channelSnap.data();
            setdata(channelData);
        } catch(e){
            console.log(e);
        }
    },[])
    
    useEffect(() => {
        fetchData()
        .catch(console.error)
    },[fetchData]);

    return (
        <div className="sidebar-channel" onClick={() =>{
            dispatch(
                setChannelInfo({
                channelId: id,
                channelName: data.channelName,
                description: data.description,
                imageUrl: data.imageUrl
                }),
            )
            dispatch(
                notEditProfile(),
            )
            dispatch(
                notNewChannel()
            )
            }}>
            <h5>
                <span className='sidebar-channel__hash'>{'{ }'}</span>
                {data.channelName}
            </h5>
        </div>
    )
}

export default SidebarChannel
