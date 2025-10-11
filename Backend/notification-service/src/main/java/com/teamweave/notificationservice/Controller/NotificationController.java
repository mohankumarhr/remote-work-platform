package com.teamweave.notificationservice.Controller;

import com.teamweave.notificationservice.Entity.Notification;
import com.teamweave.notificationservice.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    private NotificationService service;

    @GetMapping("/{userId}")
    public List<Notification> getNotifications(@PathVariable int userId) {
        return service.getNotificationsForUser(userId);
    }

}
