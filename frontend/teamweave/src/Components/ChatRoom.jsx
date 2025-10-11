import React, { useState, useEffect } from "react";
import { connectWebSocket, sendMessage, disconnectWebSocket, sendTypingIndicator } from "../websocket";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatByReceiver, fetchTeamChat } from "../API/messagesAPI";
import { addMessage, clearMessages } from "../Redux/Chat/chatSlice";


const ChatRoom = ({ userId, teamId, directTo, members = [], type, ShowTypingIndicator}) => {
  // const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState({});

  // const projectsDetailedData = []
  const messages = useSelector((state) => state.getAllMessages.value)


  useEffect(() => {
  connectWebSocket( 
    (newMessage) => {
     
      // Typing indicator event
      if (newMessage.typing) {
        if (newMessage.senderId !== userId) {
          setOtherTyping(newMessage);
          setTimeout(() => setOtherTyping(false), 1500);
        }
        return;
      }
      dispatch(addMessage(newMessage));
    },
    teamId,
    directTo,
    userId
  );
  return () => disconnectWebSocket();
}, [teamId, directTo, userId, dispatch]);

  useEffect(()=>{
    ShowTypingIndicator(otherTyping)
  }, [otherTyping])

  // useEffect(() => {
  //   connectWebSocket((newMessage) => {
  //     // Team chat: show all messages for the team
  //     // Direct chat: show only messages between current user and directTo
  //     // No local state update, rely on Redux for message list
  //     dispatch(fetchChatByReceiver({ senderId: userId, receiverId: directTo, teamId }));
  //   }, teamId, directTo);
  //   return () => disconnectWebSocket();
  // }, [teamId, directTo, userId, dispatch]);

  // useEffect(() => {
  //   connectWebSocket(
  //     (newMessage) => {
  //       console.log("📩 New WS message:", newMessage); // debug
  //       dispatch(addMessage(newMessage)); // append to redux state
  //     },
  //     teamId,
  //     directTo,
  //     userId
  //   );

  //   return () => disconnectWebSocket();
  // }, [teamId, directTo, userId, dispatch]);

  useEffect(() => {
    // Initial history load
    setInput("")
    if (directTo) {
      dispatch(fetchChatByReceiver({ senderId: userId, receiverId: directTo }));
    } else if (teamId) {

      dispatch(clearMessages());
      dispatch(fetchTeamChat({ teamId }));
    }
  }, [dispatch, directTo, teamId]);



  const handleSend = () => {
    console.log(messages)
    if (input.trim()) {
      const chatMessage = {
        senderId: userId,
        content: input,
        timestamp: new Date(),
        teamId: teamId,
        receiverId: directTo || null,
        type: type
      };
      sendMessage(chatMessage);
      setInput("");
      if (directTo) {
        dispatch(fetchChatByReceiver({ senderId: userId, receiverId: directTo }));
      } else if (teamId) {
        dispatch(fetchTeamChat({ teamId }));
      }
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      // Always send correct isTeam value
      sendTypingIndicator({
        senderId: userId,
        receiverId: directTo || null,
        teamId: teamId || null,
        isTeam: !!teamId && !directTo, // true for team chat, false for direct chat
        typing: true
      });
      setTimeout(() => setIsTyping(false), 1200);
    }
  };

  // Scroll to bottom on messages update
  const messagesEndRef = React.useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  return (
    <div className="chatroom-app-ui">
      <div className="chatroom-main">
        <div className="chatroom-messages">
          {messages.length === 0 ? (
            <div className="chatroom-empty">No messages yet.</div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`${msg.senderId === userId ? "chatroom-message-self" : "chatroom-message"}`}
                  title={new Date(msg.timestamp).toLocaleString()}
                >
                  <div className="chatroom-message-meta">
                    <span className="chatroom-message-time">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {teamId && msg.senderId != userId && <span className="chatroom-message-sender">{msg.senderId}</span>}
                  </div>
                  <div className={`chatroom-message-body${msg.senderId === userId ? " chatroom-message-self-body" : ""}`}>
                    <div className="chatroom-message-content">{msg.content}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        <div className="chatroom-input-bar">
          <input
            className="chatroom-input"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="chatroom-send-btn"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
