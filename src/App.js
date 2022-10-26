import React from 'react';
import './App.css';
import { Login, Main, } from './components';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice'
import {  useAuth } from './firebase';

function App() {
  useAuth();
  const user = useSelector(selectUser);

  return (
    <div className="app">
      {user ? (
        <Main/>
      ) : (
        <Login user={user}/>
      )}
    </div>
  );
}

export default App;
