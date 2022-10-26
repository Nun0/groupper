import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import "firebase/firestore";
import { useEffect } from "react";
import { login, logout } from "./features/userSlice";
import { useDispatch } from "react-redux";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MSG_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MESURE_ID
};

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: 'select_account'
});


// custom hook
export function useAuth(){
    const dispatch = useDispatch();
    useEffect(()=> {
        const unsub = onAuthStateChanged(auth, authUser => {
            if(authUser){
                dispatch(
                    login({
                        uid: authUser.uid,
                        photo: authUser.photoURL,
                        email: authUser.email,
                        displayName: authUser.displayName
                    })
                );
            }
        return unsub;
    })
    },[dispatch])

    
}

async function verify(u){
    const usersCollection = collection( db, 'users');
    const userRef = doc(usersCollection, u.uid);
    const uRef = await getDoc(userRef)
    if(uRef.data()){
        updateDoc(userRef, {displayName: u.displayName, photo:u.photoURL, status: 'online'})
        const userSnap =  await getDoc(userRef);
        const userData = userSnap.data();
        if(userData.blacklisted === true){
            console.log(userSnap.blacklisted);
        } else {
            updateDoc(userRef, {blacklisted: false}) 
        }
    } else {
        setDoc(userRef, {displayName: u.displayName, photo:u.photoURL, status: 'online', role: 'user'})
    }
}

export async function signup(){
    await signInWithPopup(auth, provider)
            .then(async (result) => {
                await verify(result.user);
            }).catch((error) => {
                console.log(error);
            });
}

export async function signout(auth){
    signOut(auth);
}

const storage = getStorage(firebase);

export { auth, provider, storage, updateProfile};
export default db;