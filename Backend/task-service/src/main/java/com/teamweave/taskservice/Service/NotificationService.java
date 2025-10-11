package com.teamweave.taskservice.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamweave.taskservice.DTO.NotificationKafkaEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void notifyUser(int receiverId, String message, String type) {
        NotificationKafkaEvent event = new NotificationKafkaEvent(receiverId, message, type);

        try {
            ObjectMapper mapper = new ObjectMapper();
            String content = mapper.writeValueAsString(event);
            kafkaTemplate.send("notification-events", content);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
