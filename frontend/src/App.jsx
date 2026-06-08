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
function App(){


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
   element={<Feed/>}
   />

    </Routes>
    </div>
  );
}

export default App;