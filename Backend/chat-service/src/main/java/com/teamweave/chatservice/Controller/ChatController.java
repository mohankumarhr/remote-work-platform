package com.teamweave.chatservice.Controller;

import com.teamweave.chatservice.Entity.ChatMessage;
import com.teamweave.chatservice.Service.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatController {

    @Autowired
    private ChatMessageService chatService;

    @GetMapping("/team")
    public List<ChatMessage> getTeamMessages(@RequestParam int teamId) {
        return chatService.getTeamMessages(teamId);
    }

    @GetMapping("/direct")
    public List<ChatMessage> getDirectMessages(
            @RequestParam int senderId,
            @RequestParam int receiverId
    ) {
        return chatService.getDirectMessages(senderId, receiverId);
    }
}
