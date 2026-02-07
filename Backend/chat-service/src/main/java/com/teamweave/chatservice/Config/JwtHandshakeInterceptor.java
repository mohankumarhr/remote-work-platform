package com.teamweave.chatservice.Config;

import com.localutil.Filter.JwtFilter;
import com.localutil.Service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.net.URI;
import java.util.Map;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    @Autowired
    private JwtService jwtUtil;

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {

        String token = null;

        System.out.println("==== WS HANDSHAKE START ====");

        System.out.println("Headers: " + request.getHeaders());

        String cookieHeader = request.getHeaders().getFirst("cookie");

        if (cookieHeader == null) return false;

        for (String cookie : cookieHeader.split(";")) {
            if (cookie.trim().startsWith("jwtToken=")) {
                token = cookie.trim().substring("jwtToken=".length());
            }
        }

        System.out.println("Authorization header: " + token);

        if (token == null) return false;

        String username = jwtUtil.extractUsername(token);

        if (!jwtUtil.isTokenValid(token, username)) return false;

        int userId = jwtUtil.extractAllClaims(token).get("userId", Integer.class);

        attributes.put("userId", userId);

        return true;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {

        // No logic needed here for now
    }
}

