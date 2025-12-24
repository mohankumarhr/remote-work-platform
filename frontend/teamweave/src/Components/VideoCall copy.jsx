import React, { useEffect, useRef, useState } from 'react';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff } from 'react-icons/fi';
import "../Styles/VideoCall.css"; // ✅ Include this CSS file
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setConnected, clearIncomingOffer } from '../Redux/VideoCall/signalingSlice';
import { getCurrentUserId } from '../data';


// Add this new component at the top of your VideoCall.jsx file

const RemoteVideo = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // This effect runs whenever the stream prop changes.
    if (stream && videoRef.current) {
      // Attach the stream to the video element.
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="video-element"
    />
  );
};

const VideoCall = ({ userId, signalingServerUrl, peerId, targets = [] }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const localVideoRef = useRef(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const peerConnections = useRef({});
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const didInitialize = useRef(false);
  const location = useLocation();
   const savedOnMessage = useRef(null);
  // const cameraOffTimeoutRef = useRef(null);
  // const cameraOffTimeoutRef = useRef(null);

  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [inCall, setInCall] = useState(true);

  const { socket, incomingOffer } = useSelector((state) => state.signaling);

  const peerConnectionRef = useRef(null);

  useEffect(() => {
    // We create an async function inside useEffect to manage the setup
    const initializeCall = async () => {

      if (didInitialize.current) {
        return; // Don't run the effect a second time in Strict Mode
      }
      didInitialize.current = true;

       if (!socket) {
          console.error("No shared socket found. Returning to home.");
          // navigate("/");
          return;
        }else {
          console.log("shared socket found");
        }


      try {
        // --- STEP 1: GET CAMERA FIRST ---
        // This await is crucial. Nothing else runs until the user allows the camera.
        await startCamera();
      

        socketRef.current = socket;
        savedOnMessage.current = socket.onmessage;

        socketRef.current.onmessage = async (event) => {
          // ... (your existing onmessage logic is fine)
          const msg = JSON.parse(event.data);
          const { type, from, payload } = msg;
          if (from === userId) return;

          switch (type) {
            case "offer":
              await handleOffer(from, payload);
              break;
            case "answer":
              await handleAnswer(from, payload);
              break;
            case "candidate":
              if (peerConnections.current[from]) {
                await peerConnections.current[from].addIceCandidate(new RTCIceCandidate(payload));
              }
              break;
            case "call-rejected":
              alert(`❌ User ${from} rejected your call`);
              if (peerConnections.current[from]) {
                peerConnections.current[from].close();

                // This is the most important part:
                // Remove them from the list so endCall() won't message them
                delete peerConnections.current[from];
              }
              break;
            case "call-end":
              console.log("Ended")
              handleEndCall(from);
              break
            default:
              break;
          }
        };


  const receivingOffer = incomingOffer && incomingOffer.from !== getCurrentUserId()
        ? incomingOffer.offer
        : null;
        console.log("incomming offer", incomingOffer)
        if (receivingOffer) {
          // --- We are the RECEIVER ---
          console.log(`Socket open, answering call from peer: ${peerId}`);
          await handleOffer(peerId, receivingOffer); // Run the existing handleOffer
          dispatch(clearIncomingOffer()); // Clean up the offer from Redux
        } else if (peerId) {

          // --- We are the CALLER ---

          console.log(`Socket open, auto-calling peer: ${peerId}`);

          await callUser(peerId); // Run the existing callUser

        }

      }  catch (err) {
        console.error("Failed to initialize call (Did user deny camera?):", err);
        // Maybe navigate back or show an error
      }
    };

    // Run the setup
    initializeCall();

    // --- Cleanup Function ---
    return () => {
      console.log("Cleaning up VideoCall component...");

      if (socketRef.current) {
        socketRef.current.onmessage = savedOnMessage.current;
      }
      // Stop the camera
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      // Close all peer connections
      Object.values(peerConnections.current).forEach(pc => pc.close());
      // Close the socket
      socketRef.current?.close();
    };

  }, [signalingServerUrl, userId, peerId, dispatch]); // Make sure all dependencies are here


  const startCamera = async () => {
    try {
      // Try to use real camera first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      console.log("✅ Using real camera stream");
    } catch (err) {
      console.warn("⚠️ Real camera unavailable, switching to fake stream:", err);

      // Create fake canvas stream
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      let hue = 0;

      // Generate a simple animation (colored rectangle)
      setInterval(() => {
        ctx.fillStyle = `hsl(${hue % 360}, 100%, 50%)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "30px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText("Fake Video Stream", 120, 240);
        hue += 5;
      }, 100);

      const fakeStream = canvas.captureStream(30);
      localStreamRef.current = fakeStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = fakeStream;

      console.log("🎨 Using fake video stream (for testing second tab)");
    }
  };


  const createPeerConnection = (peerId) => {
    const pc = new RTCPeerConnection();

    localStreamRef.current.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current));

    pc.ontrack = (event) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [peerId]: event.streams[0],
      }));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.send(
          JSON.stringify({
            type: "candidate",
            from: userId,
            to: peerId,
            payload: event.candidate,
          })
        );
      }
    };

    peerConnections.current[peerId] = pc;
    return pc;
  };

  const callUser = async (peerId) => {
    const pc = createPeerConnection(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socketRef.current.send(
      JSON.stringify({
        type: "offer",
        from: userId,
        to: peerId,
        payload: offer,
      })
    );
  };

  const handleOffer = async (peerId, offer) => {

    const pc = createPeerConnection(peerId);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socketRef.current.send(
      JSON.stringify({
        type: "answer",
        from: userId,
        to: peerId,
        payload: answer,
      })
    );
  };

  const handleAnswer = async (peerId, answer) => {
    const pc = peerConnections.current[peerId];
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleEndCall = (from) => {
    console.log(`📞 Call ended by user ${from}`);

    Object.values(peerConnections.current).forEach(pc => pc.close());
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    setInCall(false);

    alert("Call ended by the other user.");
    navigate("/");
    window.location.reload();
  };


  // ===== Controls =====
  const toggleMic = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicEnabled(audioTrack.enabled);
    }
  };

  // In your component, create a ref for the timeout
  const cameraOffTimeoutRef = useRef(null);

  const toggleCamera = async () => {
    if (!localStreamRef.current || !localVideoRef.current) return;

    // Clear any pending timeout to prevent bugs if the user clicks rapidly
    clearTimeout(cameraOffTimeoutRef.current);

    const videoElement = localVideoRef.current;
    const isCameraEnabled = localStreamRef.current.getVideoTracks().length > 0 &&
      localStreamRef.current.getVideoTracks()[0].readyState === 'live';

    if (isCameraEnabled) {
      // --- TURNING CAMERA OFF (Hybrid Approach) ---
      const track = localStreamRef.current.getVideoTracks()[0];

      // 1. Mute immediately for instant UI feedback
      track.enabled = false;
      console.log("Track muted instantly.");

      // 2. Schedule the track to be fully stopped after a short delay
      cameraOffTimeoutRef.current = setTimeout(() => {
        track.stop(); // This will turn the light off
        videoElement.srcObject = null;
        localStreamRef.current.removeTrack(track);
        console.log("Track stopped, light should be off.");
      }, 1500); // 1.5-second delay

      setCameraEnabled(false);

    } else {
      // --- TURNING CAMERA BACK ON ---
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        localStreamRef.current = newStream;
        videoElement.srcObject = newStream;
        setCameraEnabled(true);
      } catch (err) {
        console.error("Error starting camera:", err);
      }
    }
  };

  const endCall = () => {
    // 1. Tell EVERYONE you are leaving
    if (socketRef.current?.readyState === WebSocket.OPEN) {

      // Get all peer IDs you are currently connected to
      const connectedPeerIds = Object.keys(peerConnections.current);

      connectedPeerIds.forEach(id => {
        console.log(`Notifying ${id} that call is ending.`);
        socketRef.current.send(
          JSON.stringify({
            type: "call-end",
            from: userId,
            to: id, // ✅ Send to each connected peer
            payload: "Call end",
          })
        );
      });
    }

    // 2. Clean up your own resources
    Object.values(peerConnections.current).forEach(pc => pc.close());
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    setInCall(false);
    navigate("/");
    window.location.reload(); // Note: window.location.reload() is a bit aggressive, but this matches your original code
  };

  if (!inCall) {
    return (
      <div className="call-ended">
        <h2>Call Ended</h2>
        {/* <button onClick={() => window.location.reload()}>Start New Call</button> */}
      </div>
    );
  }

  return (
    <div className="video-call-container">
      {/* <h2 className="title">Group Video Call</h2> */}

      <div className="video-grid">
        {/* Local Video */}
        <div className="video-card">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`video-element ${!cameraEnabled ? "video-off" : ""}`}
          />
          <div className="video-label">You {micEnabled ? "" : "(Muted)"}</div>
        </div>

        {/* Remote Videos */}
        {Object.entries(remoteStreams).map(([peerId, stream]) => (
        <div key={peerId} className="video-card">
          
          {/* Use the dedicated component */}
          <RemoteVideo stream={stream} /> 

          <div className="video-label">User {peerId}</div>
        </div>
      ))}
      </div>

      {/* Controls */}
      <div className="controls-bar">
        <button
          onClick={toggleMic}
          className={`control-btn ${micEnabled ? "btn-green" : "btn-red"}`}
        >
          {micEnabled ? <FiMic size={22} /> : <FiMicOff size={22} />}
        </button>

        <button
          onClick={toggleCamera}
          className={`control-btn ${cameraEnabled ? "btn-green" : "btn-red"}`}
        >
          {cameraEnabled ? <FiVideo size={22} /> : <FiVideoOff size={22} />}
        </button>

        <button onClick={endCall} className="control-btn btn-red">
          <FiPhoneOff size={22} />
        </button>
      </div>

      {/* Test Call Button */}
      <button className="call-btn" onClick={() => callUser(peerId)}>
        Call User 13
      </button>
    </div>
  );
};

export default VideoCall;
