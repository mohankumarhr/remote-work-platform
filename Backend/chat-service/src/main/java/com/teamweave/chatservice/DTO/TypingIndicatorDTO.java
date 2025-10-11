package com.teamweave.chatservice.DTO;


public class TypingIndicatorDTO {
    private Long senderId;
    private Long receiverId;
    private Long teamId;
    private boolean isTeam;
    private boolean isTyping;

    public TypingIndicatorDTO() {
    }
    public TypingIndicatorDTO(Long senderId, Long receiverId, Long teamId, boolean isTeam, boolean isTyping) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.teamId = teamId;
        this.isTeam = isTeam;
        this.isTyping = isTyping;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public boolean isTeam() {
        return isTeam;
    }

    public void setTeam(boolean team) {
        isTeam = team;
    }

    public boolean isTyping() {
        return isTyping;
    }

    public void setTyping(boolean typing) {
        isTyping = typing;
    }
    @Override
    public String toString() {
        return "TypingIndicatorDTO{" +
                "senderId=" + senderId +
                ", receiverId=" + receiverId +
                ", teamId=" + teamId +
                ", isTeam=" + isTeam +
                ", isTyping=" + isTyping +
                '}';
    }
}
