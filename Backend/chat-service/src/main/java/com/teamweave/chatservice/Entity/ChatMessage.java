package com.teamweave.chatservice.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int senderId;
    private int receiverId; // for direct
    private int teamId;     // for team chat
    private String content;
    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    private ChatType type;

    public ChatMessage() {
    }
    public ChatMessage(int senderId, int receiverId, int teamId, String content, LocalDateTime timestamp, ChatType type) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.teamId = teamId;
        this.content = content;
        this.timestamp = timestamp;
        this.type = type;
    }
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public int getSenderId() {
        return senderId;
    }
    public void setSenderId(int senderId) {
        this.senderId = senderId;
    }
    public int getReceiverId() {
        return receiverId;
    }
    public void setReceiverId(int receiverId) {
        this.receiverId = receiverId;
    }
    public int getTeamId() {
        return teamId;
    }
    public void setTeamId(int teamId) {
        this.teamId = teamId;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    public ChatType getType() {
        return type;
    }
    public void setType(ChatType type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "id=" + id +
                ", senderId=" + senderId +
                ", receiverId=" + receiverId +
                ", teamId=" + teamId +
                ", content='" + content + '\'' +
                ", timestamp=" + timestamp +
                ", type=" + type +
                '}';
    }
}
