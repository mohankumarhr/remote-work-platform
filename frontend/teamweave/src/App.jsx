import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from "./Pages/Dashboard"
import Teams from "./Pages/Teams"
import Tasks from "./Pages/Tasks"
import Login from './Pages/Login'
import Register from './Pages/Register'
import ManageTeams from './Pages/ManageTeams'
import TeamChatPage from './Pages/TeamChatPage'
import VideoCallPage from './Pages/VideoCallPage'
import Profile from './Pages/Profile'

function App() {
  
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/manage" element={<ManageTeams />} />
          <Route path="/chat" element={<TeamChatPage />} />
          <Route path="/call" element = {<VideoCallPage />} />
          <Route path="/profile" element = {<Profile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
