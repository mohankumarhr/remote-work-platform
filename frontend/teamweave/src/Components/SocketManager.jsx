// src/components/SocketManager.jsx (NEW FILE)
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setConnected, setSocket, setIncomingOffer, clearIncomingOffer } from '../Redux/VideoCall/signalingSlice';
import { getCurrentUserId, callServiceUrl } from '../data';
import CallNotification from './CallNotification';

// This component wraps your app and manages the global socket
const SocketManager = ({ children }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const userId = getCurrentUserId(); // Get the user ID once
  const didInitialize = useRef(false);
  const [incomingCall, setIncomingCall] = useState(null);

  // Handle accept call - moved outside useEffect
  const handleAcceptCall = () => {
    if (incomingCall) {
      // User accepted: navigate to the call page and pass the offer
      navigate(`/call/${incomingCall.peerId}`, { state: { offer: incomingCall.offer } });
      setIncomingCall(null);
    }
  };

  // Handle reject call - moved outside useEffect
  const handleRejectCall = () => {
    if (incomingCall) {
      // User rejected: send "call-rejected" message
      socketRef.current.send(
        JSON.stringify({
          type: "call-rejected",
          from: userId,
          to: incomingCall.peerId,
          payload: "Call rejected",
        })
      );
      setIncomingCall(null);
      dispatch(clearIncomingOffer());
    }
  };

  useEffect(() => {
    // Connect to the WebSocke

    socketRef.current = new WebSocket(`${callServiceUrl}/ws/video?userId=${getCurrentUserId()}`);
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
        case "call-end":
          // Handle call-end from other user before accepting the call
          console.log(`SocketManager: User ${from} ended the call`);
          if (incomingCall && incomingCall.peerId === from) {
            // If we still have an incoming call notification, close it
            dispatch(clearIncomingOffer());
            setIncomingCall(null);
            alert(`User ${from} ended the call before you could answer.`);
            
          }
          break;
        default:
          // Other messages ("answer", "candidate") are handled by VideoCall.jsx,
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
    const handleOffer = (peerId, offerPayload) => {
      const callerName = offerPayload?.callerName || offerPayload?.name || offerPayload?.username;
      const offer = offerPayload?.offer ?? offerPayload; // keep compatibility if payload is plain SDP
      // Store the complete payload to preserve callerName and cameraEnabled
      dispatch(setIncomingOffer({ from: peerId, offer: offerPayload }));
      setIncomingCall({ peerId, offer, callerName });
    };

    // Global cleanup when the whole app unmounts
    return () => {
      console.log("it is clossing")
      socketRef.current?.close();
    };
  }, [userId]);

  return (
    <>
      {children}
      {incomingCall && (
        <CallNotification
          peerId={incomingCall.peerId}
          callerName={incomingCall.callerName}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
          closeToast={() => setIncomingCall(null)}
        />
      )}
    </>
  );
};

export default SocketManager;