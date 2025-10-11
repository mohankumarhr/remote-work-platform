import React, { useEffect, useRef, useState } from 'react'

const VideoCall = ({ userId, signalingServerUrl }) => {
  const localVideoRef = useRef(null);
  const [remoteStreams, setRemoteStreams] = useState({}); // { peerId: MediaStream }
  const peerConnections = useRef({});
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    // Connect to signaling server (WebSocket)
    socketRef.current = new WebSocket(signalingServerUrl);

    socketRef.current.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      const { type, from, payload } = msg;

      if (from === userId) return; // ignore self messages

      switch (type) {
        case "offer":
          await handleOffer(from, payload);
          break;
        case "answer":
          await handleAnswer(from, payload);
          break;
        case "candidate":
          if (peerConnections.current[from]) {
            await peerConnections.current[from].addIceCandidate(
              new RTCIceCandidate(payload)
            );
          }
          break;
        default:
          break;
      }
    };

    startCamera();

    return () => {
      socketRef.current.close();
    };
  }, []);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStreamRef.current = stream;
    localVideoRef.current.srcObject = stream;
  };

  const createPeerConnection = (peerId) => {
    const pc = new RTCPeerConnection();

    // Send local tracks
    localStreamRef.current.getTracks().forEach((track) =>
      pc.addTrack(track, localStreamRef.current)
    );

    // When remote track arrives
    pc.ontrack = (event) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [peerId]: event.streams[0],
      }));
    };

    // ICE candidates
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

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Group Video Call</h2>

      {/* Local video */}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="rounded-2xl border w-48 h-36"
      />

      {/* Remote videos */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {Object.entries(remoteStreams).map(([peerId, stream]) => (
          <video
            key={peerId}
            autoPlay
            playsInline
            className="rounded-2xl border w-48 h-36"
            ref={(video) => {
              if (video) video.srcObject = stream;
            }}
          />
        ))}
      </div>

      {/* Example button: Call another user */}
      <button
        onClick={() => callUser(13)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl"
      >
        Call User-2
      </button>
    </div>
  );
}

export default VideoCall