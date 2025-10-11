package com.teamweave.notificationservice.Service;

import com.teamweave.notificationservice.Entity.Notification;
import com.teamweave.notificationservice.Entity.NotificationType;
import com.teamweave.notificationservice.Repo.NotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationRepo notificationRepo;

    public void sendNotification(int recipientId, String content, NotificationType type) {
        Notification notification = new Notification();
        notification.setReceiverId(recipientId);
        notification.setMessage(content);
        notification.setType(type);
        notification.setRead(false);
        notification.setTimestamp(LocalDateTime.now());

        notificationRepo.save(notification);

        messagingTemplate.convertAndSend(
                "/topic/notification/" + recipientId,
                notification
        );
    }

    public List<Notification> getNotificationsForUser(int userId) {
        return notificationRepo.findByReceiverIdOrderByTimestampDesc(userId);
    }
}
