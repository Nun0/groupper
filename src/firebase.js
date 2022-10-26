import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import "firebase/firestore";
import { useEffect } from "react";
import { login } from "./features/userSlice";
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
        updateDoc(userRef, {status: 'online', role: 'user'})
        const userSnap =  getDoc(userRef);
        if(!userSnap.hasOwnProperty('blacklisted')){ updateDoc(userRef, {blacklisted: false}) }
        else if (userSnap.valueOf('blacklisted') === true){ signOut(auth)}
    }else {
        setDoc(userRef, {status: 'online', role: 'user', blacklisted: false})
    }
}

export async function signup(){
    await signInWithPopup(auth, provider)
            .then((result) => {
                verify(result.user);
            }).catch((error) => {
                console.log(error);
            });
}

export async function signout(auth){
    signOut(auth);
}

const storage = getStorage(firebase);

export { auth, provider, storage};
export default db;