package com.teamweave.taskservice.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class EventListener {

    @Autowired
    TaskService taskService;

    @Autowired
    ProjectService projectService;

    @KafkaListener(topics = "team-events", groupId = "task-service", containerFactory = "kafkaListenerContainerFactory")
    public void handleTeamDeletedEvent(String payload) {
        if (payload == null || payload.trim().isEmpty()) {
            System.out.println("Received empty message, ignoring.");
            return;
        }
        try {
            Integer teamId = Integer.valueOf(payload.trim());
            System.out.println("Successfully parsed Team ID: " + teamId);
            // Add your deletion logic here
            System.out.println("Received team deleted event: " + teamId);
            ResponseEntity<String> response = projectService.deleteProjectsByTeamId(teamId);
            System.out.println("Project service response: " + response.getBody());
            String taskResponse =  taskService.deleteTasksByTeamId(teamId);
            System.out.println("Task service response: " + taskResponse);

        } catch (NumberFormatException e) {
            System.err.println("Failed to parse Team ID from payload: '" + payload + "'");
            // Log the error and move on, so the consumer doesn't get stuck
        }
    }

}
