import React, {  useContext, useEffect, useState } from 'react'
import moment from 'moment';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from '@firebase/firestore';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GifIcon from '@mui/icons-material/Gif';
import { login, notEditProfile } from '../features/userSlice'
import db, { storage} from '../firebase';
import { getAuth, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ChatHeader from './ChatHeader'
import Message from './Message';
import { v4 } from 'uuid';
import './styles/Chat.css'
import NewChannelForm from './NewChannelForm';
import EditProfileForm from './EditProfileForm';
import ChannelCard from './ChannelCard';

const  Chat = ({ userContext, channelContext }) => {
    
    const { dispatch, editProfile, user, editingProfile } = useContext(userContext)
    const { channelId, isSearchChannel, searchChannel, setSearchChannel, newChannel, setChannelInfo, channels} = useContext(channelContext)
    
    const [input, setInput] = useState('');
    const [inputImage, setInputImage] = useState('');
    const [messages, setMessages] = useState([]);
    const [photo, setPhoto] = useState(user.photo);
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');

    const editProfileInitialValues = {
        displayName: user.displayName,
    }

    useEffect(()=>{
        setSearchChannel([...searchChannel, ...channels]);
    },[])

    const handleSubmitUser = async (values) => {
        const auth = getAuth();
        if(image){
            const imageRef = ref(storage, `channels/${image.name + v4()}`)
            uploadBytes(imageRef, image)
                .then(async () => {
                    let URL = await getDownloadURL(imageRef);
                    const userRef = doc(db, 'users', user.uid)
                    updateDoc(userRef, {displayName: values.displayName, photo: URL})
                    updateProfile(auth.currentUser, {
                        displayName: values.displayName, photoURL: URL
                    }).then(()=>{
                        console.log('Profile updated successfully');
                        dispatch(
                            login({
                                uid: user.uid,
                                photo: URL,
                                email: user.email,
                                displayName: values.displayName
                            })
                        );
                    }).catch((error) => {console.log(error)});
            })
        }else {
            if(values.displayName !== user.displayName){
                const userRef = doc(db, 'users', user.uid)
                updateDoc(userRef, {displayName: values.displayName})
                updateProfile(auth.currentUser, {displayName: values.displayName})
                .then(()=>{
                    console.log('Profile updated successfully');
                    dispatch(
                        login({
                            uid: user.uid,
                            photo: user.photo,
                            email: user.email,
                            displayName: values.displayName
                        })
                    );
                }).catch((error) => {console.log(error)});
            }
        }
        dispatch(
            notEditProfile()
        )
    };

    const handleSubmit = async (values) => {
        const channelsCollection = collection(db, 'channels');
        if(image){
            const imageRef = ref(storage, `channels/${image.name + v4()}`)
            uploadBytes(imageRef, image)
            .then(async () => {
                let URL = await getDownloadURL(imageRef);
                await addDoc(channelsCollection, ({
                    channelName: values.channelName,
                    description: values.description,
                    imageUrl: URL
                })).then((res)=>{
                    const userRef = doc( db, 'users', user.uid)
                    const channelsCol = collection(userRef, 'channels');
                    const channelRef = doc(channelsCol, res.id)
                    setDoc(channelRef, { role: 'owner' });
                    setUrl('');
                    dispatch(
                        setChannelInfo({
                            searchChannel: false,
                            newChannel:false,
                            editChannel:false,
                            channelName:res.channelName,
                            channelId:res.channelId,
                            description:res.description,
                            imageUrl:res.imageUrl
                    }))
                }).catch((e) => {console.log(e)})
            })
        } else {
            await addDoc(channelsCollection, ({
                channelName: values.channelName,
                description: values.description,
                imageUrl: url
            })).then((res)=>{
                const userRef = doc( db, 'users', user.uid)
                const channelsCol = collection(userRef, 'channels');
                const channelRef = doc(channelsCol, res.id)
                setDoc(channelRef, { role: 'owner' });
                setUrl('');
                dispatch(
                    setChannelInfo({
                        searchChannel: false,
                        newChannel:false,
                        editChannel:false,
                        channelName:res.channelName,
                        channelId:res.channelId,
                        description:res.description,
                        imageUrl:res.imageUrl
                }))
            }).catch((e) => {console.log(e)})
        }
    }

    const sendMessage = async (e) => {
        e.preventDefault();
        if(input){
            const channelRef = doc(db, 'channels', channelId);
            const messagesCollection = collection( channelRef, 'messages');
            await addDoc(messagesCollection, ({
                timestamp: new serverTimestamp(),
                message: input,
                user: user,
            })).catch((e) => {console.log(e)})
        }
        setInput('');
    }

    function getUNIXTime(dt) {
        let unix = moment.utc(dt*1000).format('D MMM. YYYY [at] HH:mm');;
        return unix;   
    }

    useEffect(() => {
        if(channelId) {
            const channelsCollection = doc(db, 'channels', channelId);
            const messagesCollection = collection( channelsCollection, 'messages');
            const q = query(messagesCollection, orderBy('timestamp', 'asc'));
            const unsub = onSnapshot(
                q, (snapshot) => {
                    setMessages(snapshot.docs?.map(doc => ({
                        message: doc.data(),
                        id: doc.id,
                        sender: doc.data().user,
                        timestamp: getUNIXTime(doc.data().timestamp?.seconds),
                    })));
                })
            return unsub;
        } else {
            setMessages([]);
        }
    }, [channelId]);

    useEffect(() =>{
        if(newChannel) {
            setMessages([]);
        }
        if(editProfile) {
            setMessages([]);
        }

    },[newChannel, editProfile])

    let lastUser = null;

    return (
    <div className="chat" id="chat">
        <ChatHeader userContext={userContext} channelContext={channelContext}/>
            <div className="chat__messages" id="chat__messages">
                {messages.map((message) =>{
                        let showInfo;
                        if(lastUser === null || lastUser !== message.sender.uid){
                            showInfo = true;
                            lastUser = message.sender.uid;
                        }else if(lastUser === message.sender.uid){
                            showInfo = false;
                        }
                        return <Message
                            showInfo={showInfo}
                            key={message.id}
                            messageId={message.id}
                            timestamp={message.timestamp}
                            message={message.message}
                            userPhoto={message.sender.photo}
                            userName={message.sender.displayName}
                            userId={message.sender.uid}
                        />
                })}
                <div>
                {newChannel && (
                        <NewChannelForm handleSubmit={handleSubmit} setImage={setImage}/>)}
                {editingProfile && 
                    (<EditProfileForm 
                        handleSubmitUser={handleSubmitUser} 
                        editProfileInitialValues={editProfileInitialValues}
                        photo={photo}
                        setImage={setImage}
                    />)}
                <div className="container">
                    <div className="row justify-content-start">
                        {isSearchChannel && (
                            searchChannel?.map(({ channel, id}) => (
                                <ChannelCard
                                userContext={userContext} 
                                channelContext={channelContext}
                                key={id}
                                id={id}
                                channel={channel}
                                />
                            ))
                        )
                        }
                    </div>
                </div>
                </div>
            </div>
            <div className="chat__input">
                <span><AddCircleIcon fontSize="medium" /></span>
                <form>
                    <input 
                        value={input}
                        disabled={!channelId}
                        onChange={e => setInput(e.target.value)} 
                        placeholder={`Write your message here...`}/>
                    <button
                        disabled={!channelId}
                        className='chat__input-button' 
                        type='submit'
                        onClick={sendMessage}
                        >
                        Send Message
                    </button>
                </form>
                <div className="chat__input-icons">
                    <GifIcon />
                    <EmojiEmotionsIcon />
                </div>
            </div>
        </div>
    )
}

export default Chat