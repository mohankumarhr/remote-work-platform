import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (onMessageReceived, teamId, directTo, userId) => {
  // const socket = new SockJS("http://localhost:8085/ws");
  const socket = new SockJS(`https://chat-service-mnpe.onrender.com/ws?token=${Cookies.get("jwtToken")}`);
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("Connected to WebSocket");

      if (teamId) {
        // Team chat subscription
        stompClient.subscribe(`/topic/team.${teamId}`, (message) => {
          onMessageReceived(JSON.parse(message.body));
        });
      }

      // Always subscribe to your own private queue
      if (userId) {
        stompClient.subscribe(`/queue/user.${userId}`, (message) => {
          onMessageReceived(JSON.parse(message.body));
        });
      }
    },
  });

  stompClient.activate();
};

export const sendMessage = (chatMessage) => {
  console.log("outside")
  if (stompClient && stompClient.connected) {
    console.log("inside", chatMessage)
    stompClient.publish({
      destination: "/app/chat.send", // backend mapped endpoint
      body: JSON.stringify(chatMessage),
    });
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
  }
};

export const sendTypingIndicator = (indicator) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat.typing",
      body: JSON.stringify(indicator),
    });
  }
};
