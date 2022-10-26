import React, { useContext } from 'react'
import './styles/Chat.css'
import db from '../firebase';
import {  addDoc, collection, doc, setDoc, updateDoc } from '@firebase/firestore';
import { setChannelInfo } from '../features/appSlice';
import { notEditProfile } from '../features/userSlice';


const ChannelCard = ({ channel, userContext, id }) => {
    const { user,  } = useContext(userContext);


    async function handleJoinChannel(id){
        const userRef = doc( db, 'users', user.uid)
        const channelsCol = collection(userRef, 'channels');
        const channelRef = doc(channelsCol, id)
        setDoc(channelRef, { role: 'user' }, { merge: true })
    };



    return (
        <div className="col-md-3 g-5">
            <div key={id} className="card bg-black shadow shadow-dark">
                <div variant="top" src="jhsf" className="card-img"/>
                <div className='card-content m-2 text-light'>
                    <h2 className='card-title'>{channel.channelName}</h2>
                    <div className='card-text'>
                        {channel.description}
                    </div>
                </div>
                <div className='card-button btn btn-dark m-2' onClick={()=>handleJoinChannel(id)}>
                    Join Channel
                </div>
            </div>
        </div>
        
    )
}

export default ChannelCard