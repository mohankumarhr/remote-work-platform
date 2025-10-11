import React from 'react'
import VideoCall from '../Components/VideoCall'
import Cookies from "js-cookie";

function VideoCallPage() {


  const getCurrentUserId = () => {
    const token = Cookies.get("jwtToken")
    let userId = null
  
    if (token) {
      // Decode JWT token to get user ID
      const payload = JSON.parse(atob(token.split('.')[1]))
      userId = payload.userId || payload.id || payload.sub
      console.log("userId", userId)
      return userId
    }
  
    if (!userId) {
      console.error('Unable to get user ID from token')
      return 0
    }
    
  };

  return (
    <div>
      <VideoCall 
        userId={getCurrentUserId()}
        signalingServerUrl={`ws://localhost:8089/ws/video?userId=${getCurrentUserId()}`}
      />
    </div>
  )
}

export default VideoCallPage