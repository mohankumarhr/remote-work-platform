package com.teamweave.chatservice.Repo;

import com.teamweave.chatservice.Entity.ChatMessage;
import com.teamweave.chatservice.Entity.ChatType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepo extends JpaRepository<ChatMessage, Integer> {
    // Custom query methods can be defined here if needed
    List<ChatMessage> findByTeamIdAndType(int teamId, ChatType type);

    List<ChatMessage> findBySenderIdAndReceiverIdAndType(int senderId, int receiverId, ChatType type);
}
