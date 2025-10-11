package com.teamweave.notificationservice.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamweave.notificationservice.DTO.NotificationKafkaEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.kafka.annotation.KafkaListener;

@Component
public class NotificationKafkaListener {

    @Autowired
    private NotificationService notificationService;

    @KafkaListener(topics = "notification-events", groupId = "notification-service")
    public void listen(String message) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            NotificationKafkaEvent event = mapper.readValue(message, NotificationKafkaEvent.class);

            notificationService.sendNotification(
                    event.getReceiverId(),
                    event.getMessage(),
                    event.getType()
            );
        } catch (Exception e) {
            e.printStackTrace(); // optional: log with SLF4J
        }
    }
}
