// src/components/SocketManager.jsx (NEW FILE)
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setConnected, setSocket, setIncomingOffer, clearIncomingOffer } from '../Redux/VideoCall/signalingSlice';
import { getCurrentUserId } from '../data';

// This component wraps your app and manages the global socket
const SocketManager = ({ children }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const userId = getCurrentUserId(); // Get the user ID once
  const didInitialize = useRef(false);

  useEffect(() => {
    // Connect to the WebSocke

    socketRef.current = new WebSocket(`ws://localhost:8089/ws/video?userId=${getCurrentUserId()}`);
    socketRef.current.onopen = () => {
      console.log("✅ SocketManager: Connected");
      dispatch(setConnected(true));
      dispatch(setSocket(socketRef.current))
      // Store the socket in Redux
    };


    socketRef.current.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      const { type, from, payload } = msg;

      // Ignore messages sent from yourself
      if (from === userId) return;

      switch (type) {
        case "offer":
          // An "offer" means another user is trying to call you.
          console.log(`SocketManager: Received an incoming call offer from ${from}`);
          handleOffer(from, payload); // Use the handler defined below
          break;
        default:
          // Other messages ("answer", "candidate", "call-end") are handled by VideoCall.jsx,
          // so the SocketManager can ignore them.
          break;
      }
    };

    socketRef.current.onerror = (event) => {
      console.error("❌ SocketManager: WebSocket error observed:", event);
    };

    socketRef.current.onclose = () => {
      console.log("❌ SocketManager: Disconnected");
      dispatch(setConnected(false));
      dispatch(setSocket(null));
    };


    // This is the component that shows the "Accept/Reject" prompt
    const handleOffer = (peerId, offer) => {

      dispatch(setIncomingOffer({ from: peerId, offer }));
      const userChoice = window.confirm(`You have an incoming call from User ${peerId}. Accept?`);

      if (userChoice) {
        // User accepted: navigate to the call page and pass the offer
        navigate(`/call/${peerId}`, { state: { offer } });
      } else {
        // User rejected: send "call-rejected" message
        socketRef.current.send(
          JSON.stringify({
            type: "call-rejected",
            from: userId,
            to: peerId,
            payload: "Call rejected",
          })
        );
      }
      // We've handled the offer, so clear it from Redux
      // dispatch(clearIncomingOffer());
    };

    // Global cleanup when the whole app unmounts
    return () => {
      console.log("it is clossing")
      socketRef.current?.close();
    };
  }, [userId]);

  return <>{children}</>; // Render the rest of your app
};

export default SocketManager;