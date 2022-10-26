import React, { useState } from 'react'
export const AppContext = React.createContext();

const AppProvider = ({children}) => {
    
    const [channels, setChannels] = useState([]);
    const [userChannels, setUserChannels] = useState([]);
    const [searchChannel, setSearchChannel] = useState([]);

    return (
        <AppContext.Provider value={{ channels, setChannels, userChannels, setUserChannels, searchChannel, setSearchChannel }}>
            {children}
        </AppContext.Provider>
        
    )
}

export default AppProvider