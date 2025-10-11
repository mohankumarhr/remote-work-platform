package com.teamweave.fileservice.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
public class SharedFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    private String fileName;
    private String filePath;
    private int senderId;
    private int receiverId;
    private LocalDateTime uploadedAt;
    private int teamId;

    public SharedFile() {
    }
    public SharedFile(int id, String fileName, String filePath, int senderId,
                        int receiverId, LocalDateTime uploadedAt, int teamId) {
        this.id = id;
        this.fileName = fileName;
        this.filePath = filePath;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.uploadedAt = uploadedAt;
        this.teamId = teamId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
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

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public int getTeamId() {
        return teamId;
    }

    public void setTeamId(int teamId) {
        this.teamId = teamId;
    }
}
