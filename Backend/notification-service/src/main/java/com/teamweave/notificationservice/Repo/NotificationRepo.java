package com.teamweave.notificationservice.Repo;

import com.teamweave.notificationservice.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Integer> {
    List<Notification> findByReceiverIdOrderByTimestampDesc(int receiverId);
}
