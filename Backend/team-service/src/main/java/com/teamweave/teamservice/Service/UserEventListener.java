package com.teamweave.teamservice.Service;

import com.teamweave.teamservice.DTO.UserDeletedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class UserEventListener {

    @Autowired
    private TeamService teamService;

//    @KafkaListener(topics = "user-events", groupId = "team-service", containerFactory = "kafkaListenerContainerFactory")
    public void handleUserDeletedEvent(Integer userId) {
        System.out.println("Received USER_DELETED event for userId: " + userId);
        teamService.removeUserFromAllTeams(userId);
    }
}
