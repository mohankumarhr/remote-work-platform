package com.teamweave.taskservice.DTO;


public class NotificationKafkaEvent {
    private int receiverId;
    private String message;
    private String type;

    public NotificationKafkaEvent() {
    }

    public NotificationKafkaEvent(int receiverId, String message, String type) {
        this.receiverId = receiverId;
        this.message = message;
        this.type = type;
    }

    public int getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(int receiverId) {
        this.receiverId = receiverId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}

