package com.teamweave.chatservice.Service;

import com.teamweave.chatservice.Entity.ChatMessage;
import com.teamweave.chatservice.Entity.ChatType;
import com.teamweave.chatservice.Repo.ChatMessageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepo chatMessageRepo;

    public ChatMessage saveMessage(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        return chatMessageRepo.save(message);
    }

    public List<ChatMessage> getTeamMessages(int teamId) {
        return chatMessageRepo.findByTeamIdAndType(teamId, ChatType.TEAM);
    }

    public List<ChatMessage> getDirectMessages(int senderId, int receiverId) {
        List<ChatMessage> sentMessages = chatMessageRepo.findBySenderIdAndReceiverIdAndType(senderId, receiverId, ChatType.DIRECT);
        List<ChatMessage> receivedMessages = chatMessageRepo.findBySenderIdAndReceiverIdAndType(receiverId, senderId, ChatType.DIRECT);
        sentMessages.addAll(receivedMessages);
        sentMessages.sort(Comparator.comparing(ChatMessage::getTimestamp));
        return sentMessages;
    }

}
