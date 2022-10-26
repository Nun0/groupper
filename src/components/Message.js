import React, { useEffect, useRef, useState } from 'react'
import './styles/Message.css'
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { selectChannelId } from '../features/appSlice';
import db from '../firebase';
import { deleteDoc, doc, updateDoc } from '@firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import isURL from 'validator/lib/isURL'

const Message = ({ timestamp, message, userPhoto, userName, userId, messageId, showInfo}) => {
    const [messageEditable, setMessageEditable] = useState(false);
    const [editMessage, setEditMessage] = useState(false);
    const [editContent, setEditContent] = useState('');

    const user = useSelector(selectUser);
    const channelId = useSelector(selectChannelId);

    useEffect(() => {
        if(user.uid === userId) {
            setMessageEditable(true);
        }
    }, [user, userId])

    const updateMessage = async (e) => {
        e.preventDefault();
        if(editContent){
            const channelRef = doc(db, 'channels', channelId);
            const messageRef = doc( channelRef, 'messages', messageId);
            await updateDoc(messageRef, {
                message: editContent,
            }).then().catch(err => console.log(err));
        }
        setEditContent('');
        setEditMessage(false);
    }

    const handleEditMessageState = (e) => {
        e.preventDefault();
        return setEditMessage(true);
    }

    const handleEditContent = (e) => {
        setEditContent(e.target.value);
    }

    const handleCancel = (e) => {
        e.preventDefault();
        setEditMessage(false);
        setEditContent('');
    }

    const deleteMessage = async (e) => {
        e.preventDefault();
        const channelsCollection = doc(db, 'channels', channelId);
        const messageRef = doc( channelsCollection, 'messages', messageId);
        await deleteDoc(messageRef).then().catch(err => console.log(err));
    }

    // scrollToBottom
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView();
    };
    useEffect(scrollToBottom, [message]);

    return (
        <>
        {editMessage? (
            <div className={!showInfo?"ps-5 ms-2 py-0 message":"message"} >
                {showInfo&&<Avatar src={userPhoto}/>}
                <div className="message__info">
                    {showInfo&&(
                        <h5>
                        <span className="message__username">
                            {userName}
                        </span>
                        <span className="message__timestamp">
                            {timestamp}
                        </span>
                        </h5>
                    )}
                    <div><span><form><input className="edit__message-input" id="editMessage" autoFocus type="text" defaultValue={message.message} onChange={handleEditContent}/><button hidden type="submit" onClick={updateMessage}></button></form></span></div>
                </div>
                <span className="message__buttons">
                    <OverlayTrigger overlay={ <Tooltip>Validate</Tooltip>}>
                        <DoneIcon className='edit__message' onClick={updateMessage}/>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={ <Tooltip>Cancel</Tooltip>}>
                        <ClearIcon className='delete__message' onClick={handleCancel}/>
                    </OverlayTrigger>
                </span> 
                <div ref={messagesEndRef}/>
            </div>
        ):(
            <div className={!showInfo?"ps-5 ms-2 py-0 message":"message"} >
                {showInfo&&<Avatar src={userPhoto}/>}
                <div className="message__info">
                    {showInfo&&(
                        <h5>
                    <span className="message__username">
                        {userName}
                    </span>
                    <span className="message__timestamp">
                        {timestamp}</span>
                    </h5>
                    )}
                    
                <div>
                    <span id="message__message">
                        {message.message}
                    </span>
                    {!showInfo&&(
                        <span className="message__timestamp__info">
                            {timestamp}
                        </span>
                    )}
                </div>
                </div>
                {messageEditable? (
                        <span className="message__buttons">
                            <OverlayTrigger overlay={ <Tooltip>Edit Message</Tooltip>}>
                                <EditIcon className="edit__message" onClick={(handleEditMessageState)}/>
                            </OverlayTrigger>
                            <OverlayTrigger overlay={ <Tooltip>Delete Message</Tooltip>}>
                                <DeleteIcon className='delete__message' onClick={deleteMessage}/>
                            </OverlayTrigger>
                        </span> )
                    : null}
                <div ref={messagesEndRef}/>
            </div>
        )}
        {isURL(message.message)&&(
            <div className="image-container">
                <img src="message.message" alt="image" id="image-message"/>
            </div>
        )}
        </>
    )
}

export default Message
