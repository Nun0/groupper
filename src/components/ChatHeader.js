import React, { useContext, useEffect } from 'react'
import './styles/ChatHeader.css'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useDispatch } from 'react-redux';
import { newChannel, searchingChannel, setChannelInfo } from '../features/appSlice';
import { notEditProfile } from '../features/userSlice';
import { collection, getDocs, orderBy, query, where } from '@firebase/firestore';
import db from '../firebase';

const bracketleft = (channel) => {
    return channel ?   <span className="chat-header__hash"> {'{'}</span>
            :   <span></span>
} 

const bracketright = (channel) => {
    return channel ?   <span className="chat-header__hash"> {'}'}</span>
            :   <span></span>
}

const ChatHeader = ({  channelContext }) => {
    const { channelName, description, isSearchChannel,channels, searchChannel, setSearchChannel, searchTerm, setSearchTerm } = useContext(channelContext);
    const dispatch = useDispatch();

    const emptyState = [];

    const handleSearch = (e) => {
        const format = (e.target.value).trim().toLowerCase();
        setSearchTerm(e.target.value);
    }

    const handleClickSearch = async (e) => {
        e.preventDefault();
        dispatch(
            notEditProfile()
        )
        dispatch(
            searchingChannel()
        )
        if(searchTerm !== ''){
            setSearchChannel(emptyState);
            const searchChannelsColl = collection(db, 'channels')
            const q = query(searchChannelsColl, where('channelName', '>=', `${searchTerm}`), where('channelName', '<=', '~'), orderBy('channelName','asc'))
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setSearchChannel(searchChannel => [...searchChannel,{
                    channel: doc.data(),
                    id: doc.id,
                }]);
            });
        }else if(searchChannel.length === 0) {
            setSearchChannel([...searchChannel, ...channels]);
        } 
        setSearchTerm('');
    }

    const handleNewChannel = () => {
        dispatch(
            notEditProfile()
            )
        dispatch(
            newChannel()
        )
    };

    return (
        <>
            <div className="chat-header">
                <div className="chat-header__left">
                    <h3>
                        {bracketleft(channelName)}
                        {channelName}
                        {bracketright(channelName)}
                    </h3>
                </div>
                <div className="chat-header_right">
                    
                    <form className="chat-header__search">
                        <SearchRoundedIcon />
                        <input placeholder="Search" name="search" onChange={handleSearch} className='search'/><button hidden type="submit" onClick={handleClickSearch}></button>
                    </form>
                    <div className="chat-header__addchannel">
                        <button onClick={handleNewChannel}>New Group +</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatHeader
