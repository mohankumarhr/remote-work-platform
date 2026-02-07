package com.teamweave.chatservice.Controller;

import com.teamweave.chatservice.DTO.TypingIndicatorDTO;
import com.teamweave.chatservice.Entity.ChatMessage;
import com.teamweave.chatservice.Entity.ChatType;
import com.teamweave.chatservice.Service.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageService chatService;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage message, Principal principal) {

        Integer userId = Integer.parseInt(principal.getName());
        message.setSenderId(userId);

        System.out.println("Message Reaches :" + message.getContent());
        ChatMessage saved = chatService.saveMessage(message);

        if (message.getType() == ChatType.TEAM) {
            messagingTemplate.convertAndSend("/topic/team." + message.getTeamId(), saved);
        } else {
            messagingTemplate.convertAndSend("/queue/user." + message.getReceiverId(), saved);
        }
    }

    @MessageMapping("/chat.typing")
    public void typing(@Payload TypingIndicatorDTO indicator) {

        System.out.println("indicator "+ indicator.toString());
        if (indicator.getTeamId() != null) {
            System.out.println("Sending typing event to /topic/team." + indicator.getTeamId());
            messagingTemplate.convertAndSend("/topic/team." + indicator.getTeamId(), indicator);
        } else {
            messagingTemplate.convertAndSend("/queue/user." + indicator.getReceiverId(), indicator);
        }
    }
}
