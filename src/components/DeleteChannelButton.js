import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteChannelButton = ({ isOwner, isAdmin, deleteChannel}) => {

    if(isAdmin || isOwner) {
    return (
        <span className="channel-buttons ms-auto me-2">
            <OverlayTrigger overlay={ <Tooltip>Delete</Tooltip>}>
                <DeleteIcon className='delete__channel' onClick={deleteChannel}/>
            </OverlayTrigger>
        </span>
    )
    }
}

export default DeleteChannelButton
