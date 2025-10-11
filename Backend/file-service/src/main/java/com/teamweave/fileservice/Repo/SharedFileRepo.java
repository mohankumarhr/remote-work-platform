package com.teamweave.fileservice.Repo;

import com.teamweave.fileservice.Entity.SharedFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SharedFileRepo extends JpaRepository<SharedFile, Integer> {
    List<SharedFile> findByReceiverId(int receiverId);
    List<SharedFile> findBySenderId(int senderId);
    List<SharedFile> findByReceiverIdAndSenderId(int receiverId, int senderId);
    List<SharedFile> findByTeamId(int teamId);
    List<SharedFile> findByFileNameContainingAndTeamId(String fileName, int teamId);
    List<SharedFile> findByFileNameContainingAndReceiverId(String fileName, int receiverId);
}
