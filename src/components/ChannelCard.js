import React, { useContext } from 'react'
import './styles/ChannelCard.css'
import db from '../firebase';
import {  collection, doc, setDoc  } from '@firebase/firestore';


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
            <div key={id} className="card bg-black d-flex">
                    {channel.imageUrl&&(
                        <img variant="top" src={channel.imageUrl} className="card-img" alt="card image"/>
                    )}
                <div className="card-body p-2 d-flex flex-column text-light">
                        <h2 className='card-title'>{channel.channelName}</h2>
                        <div className='card-text'>
                            {channel.description}
                        </div>
                        <div className='card-button btn btn-dark mt-auto' onClick={()=>handleJoinChannel(id)}>
                            Join Group
                        </div>
                </div>
            </div>
        </div>
    )
}

export default ChannelCard