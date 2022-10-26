import { Avatar, Badge } from '@mui/material'
import React from 'react'
import { KeyOff, Key} from '@mui/icons-material';
import { doc, updateDoc } from '@firebase/firestore';
import db from '../firebase';

// blacklisted ? unblock : block
const SidebarUser = ({ id, user }) => {

    const blockUser = () => {
        const userRef = doc(db, 'users', id);
        updateDoc(userRef, { blacklisted: true  })
    };

    const unblockUser = () => {
        const userRef = doc(db, 'users', id);
        updateDoc(userRef, { blacklisted: false  })
    };

    return (
        <div className="d-flex align-items-center ms-4 mb-2 mt-3">
            {user.status === 'online' ? (
                <Badge color='success' variant="dot" overlap="circular" anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
                    <Avatar src={user.photo} referrerPolicy="no-referrer"/>
                </Badge>
            ) : (
                <span >
                    <Avatar src={user.photo} referrerPolicy="no-referrer"/>
                </span>
            )}
            <span className="text-white ms-2">
                {user.displayName}
            </span>
            <span className="ms-auto me-2">
                <a href="#">
                    {user.blacklisted ?
                    (<KeyOff className='text-danger' onClick={unblockUser}/>):
                    (<Key className='text-success' onClick={blockUser}/>)
                }
                </a>
                
            </span>
        </div>
    )
}

export default SidebarUser
