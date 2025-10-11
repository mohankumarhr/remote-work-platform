package com.teamweave.callservice.Config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

public class SignalingHandler extends TextWebSocketHandler {
    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = getUserId(session);

        // If this user already has a session, close the old one
        if (sessions.containsKey(userId)) {
            WebSocketSession oldSession = sessions.get(userId);
            if (oldSession.isOpen()) {
                oldSession.close(CloseStatus.NORMAL.withReason("New session opened"));
            }
        }

        sessions.put(userId, session);
        System.out.println("✅ User connected: " + userId + " (sessionId=" + session.getId() + ")");
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Map<String, Object> msg = mapper.readValue(message.getPayload(), Map.class);

        String type = (String) msg.get("type");
        String from = String.valueOf(msg.get("from")); // ✅ safe conversion
        String to = String.valueOf(msg.get("to"));     // ✅ safe conversion

        if (to != null && sessions.containsKey(to)) {
            WebSocketSession targetSession = sessions.get(to);
            if (targetSession.isOpen()) {
                targetSession.sendMessage(new TextMessage(mapper.writeValueAsString(msg)));
            }
        } else {
            System.out.println("Target user not connected: " + to);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String userId = getUserId(session);
        sessions.remove(userId);
        System.out.println("❌ User disconnected: " + userId + " (reason=" + status.getReason() + ")");
    }

    private String getUserId(WebSocketSession session) {
        String query = session.getUri().getQuery(); // e.g. "userId=123"
        String[] parts = query.split("=");
        return String.valueOf(parts[1]); // ✅ ensures it's always String
    }
}
