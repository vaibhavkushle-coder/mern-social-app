import './App.css'

import { Routes , Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from './components/protectedRoute';
import Navbar from './components/Navbar';
import Profile from './pages/profile';
import ChangePassword from './pages/ChangePassword';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Feed from './pages/Feed';
import UserProfile from './pages/UserProfile';
import PostDetail from './pages/PostDetail';
import Notifications from './pages/Notifications';
import Chat from './pages/Chat';
import ChatDetail from './pages/ChatDetail';
import { useEffect } from 'react';
import axios from 'axios';
import socket from './socket';
function App(){

   useEffect(()=>{

        async function connectSocket(){

            socket.connect();

            const token = localStorage.getItem("token");

            if(!token) return;

            try{

            const response = await axios.get(
                "https://mern-social-app-xdit.onrender.com/profile",
                {
                    headers:{
                        Authorization: token
                    }
                }
            );

            socket.emit("join",response.data.user._id);

          } catch(error){
            console.log(error);
          }
        }

        connectSocket();
       
    },[]);


  return(
    <div>


    <Routes>

   <Route 
   path="/"
   element={
   <ProtectedRoute>

    <>

    <Navbar/>

   <Home/>

</>

   </ProtectedRoute>
   }
   />

   <Route 
   path="/register"
   element={<Register/>}
   />

   <Route
   path="/login"
   element={<Login/>}
   />

   <Route
   path="/profile"
   element={

    <ProtectedRoute>

      <>
      
      <Navbar/>

      <Profile/>
      
      </>

    </ProtectedRoute>

   }/>

   <Route 
   path="/change-password"
   element={
    <ProtectedRoute>
      <>
      <Navbar/>
      <ChangePassword/>
      </>
    </ProtectedRoute>
   }/>

   <Route
   path="/create-post"
   element={
    <ProtectedRoute>
      <>
      <Navbar/>
      <CreatePost/>
      </>
    </ProtectedRoute>
   }/>

   <Route
   path="/posts"
   element={
    <ProtectedRoute>
      <>
      <Navbar/>
      <Post/>
      </>
    </ProtectedRoute>
   }
   />

   <Route
   path="/feed"
   element={
    <>
    <Navbar/>
   <Feed/>
   </>
  }/>

  <Route
  path="/user/:id"
  element={
    <>
    <Navbar/>
        <UserProfile/>

    </>
  }/>

  <Route
  path="/post/:id"
  element={
    <>
    <Navbar/>
        <PostDetail/>

    </>
  }/>

  <Route
    path="/notifications"
    element={
        <>
            <Navbar />
            <Notifications />
        </>
    }
/>

<Route
path='/chat'
element={
  <>
  <Navbar/>
  <Chat/>
  </>
}
/>

<Route
path='/chat/:id'
element={
  <>
  <Navbar/>
  <ChatDetail/>
  </>
}
/>
  
  

    </Routes>
    </div>
  );
}

export default App;