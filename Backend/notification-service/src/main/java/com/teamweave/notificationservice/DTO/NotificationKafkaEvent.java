package com.teamweave.notificationservice.DTO;

import com.teamweave.notificationservice.Entity.NotificationType;

public class NotificationKafkaEvent {
    private int receiverId;
    private String message;
    private NotificationType type;

    public NotificationKafkaEvent() {
    }

    public NotificationKafkaEvent(int receiverId, String message, NotificationType type) {
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

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }
}
