import React, { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Dashboard from "./Pages/Dashboard"
import Teams from "./Pages/Teams"
import Tasks from "./Pages/Tasks"
import Login from './Pages/Login'
import Register from './Pages/Register'
import ForgotPassword from './Pages/ForgotPassword'
import ManageTeams from './Pages/ManageTeams'
import TeamChatPage from './Pages/TeamChatPage'
import VideoCallPage from './Pages/VideoCallPage'
import Meetings from './Pages/Meetings'
import Profile from './Pages/Profile'
import VerifyEmail from './Pages/VerifyEmail'
import SocketManager from './Components/SocketManager'
import { useDispatch } from 'react-redux'
import { getCurrentUserId } from './data'
import { setConnected, setSocket, setIncomingOffer } from './Redux/VideoCall/signalingSlice'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedLayout from './Components/ProtectedLayout'

function App() {
  
  return (
    <Router>
      <SocketManager>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route element={<ProtectedLayout />} >
            <Route path="/" element={<Dashboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/manage" element={<ManageTeams />} />
            <Route path="/chat" element={<TeamChatPage />} />
            <Route path="/call/:peerId" element = {<VideoCallPage />} />
            <Route path="/call" element = {<VideoCallPage />} />
            <Route path="/profile" element = {<Profile />} />
          </Route>
        </Routes>
      </div>
       <ToastContainer />
      </SocketManager>
    </Router>
  )
}

export default App
