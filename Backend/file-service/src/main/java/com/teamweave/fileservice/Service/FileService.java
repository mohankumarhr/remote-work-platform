package com.teamweave.fileservice.Service;

import com.teamweave.fileservice.Entity.SharedFile;
import com.teamweave.fileservice.Repo.SharedFileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {

    @Value("${upload.directory}")
    private String uploadDir;

    @Autowired
    private SharedFileRepo sharedFileRepo;

    public SharedFile uploadFile(MultipartFile file, int senderId, int receiverId, int teamId) throws IOException {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get(uploadDir, filename);
        Files.copy(file.getInputStream(), path);

        SharedFile sharedFile = new SharedFile();
        sharedFile.setFileName(file.getOriginalFilename());
        sharedFile.setFilePath(path.toString());
        sharedFile.setSenderId(senderId);
        sharedFile.setReceiverId(receiverId);
        sharedFile.setTeamId(teamId);
        sharedFile.setUploadedAt(LocalDateTime.now());

        return sharedFileRepo.save(sharedFile);
    }

    public ResponseEntity<Resource> downloadFile(int fileId) throws IOException {
        SharedFile file = sharedFileRepo.findById(fileId).orElseThrow();
        Path path = Paths.get(file.getFilePath());
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getFileName())
                .body(resource);
    }

    public void deleteFile(int fileId) throws IOException {
        SharedFile file = sharedFileRepo.findById(fileId).orElseThrow();
        Path path = Paths.get(file.getFilePath());
        Files.deleteIfExists(path);
        sharedFileRepo.delete(file);
    }

    public ResponseEntity<List<SharedFile>> getFilesByReceiverId(int receiverId) {
        List<SharedFile> files = sharedFileRepo.findByReceiverId(receiverId);
        return ResponseEntity.ok(files);
    }

    public ResponseEntity<List<SharedFile>> getFilesBySenderId(int senderId) {
        List<SharedFile> files = sharedFileRepo.findBySenderId(senderId);
        return ResponseEntity.ok(files);
    }

    public ResponseEntity<List<SharedFile>> getFilesByReceiverIdAndSenderId(int receiverId, int senderId) {
        List<SharedFile> files = sharedFileRepo.findByReceiverIdAndSenderId(senderId, receiverId);
        return ResponseEntity.ok(files);
    }

    public ResponseEntity<List<SharedFile>> getFilesByTeamId(int teamId) {
        List<SharedFile> files = sharedFileRepo.findByTeamId(teamId);
        return ResponseEntity.ok(files);
    }

    public ResponseEntity<List<SharedFile>> searchFilesByNameAndTeamId(String fileName, int teamId) {
        List<SharedFile> files = sharedFileRepo.findByFileNameContainingAndTeamId(fileName, teamId);
        return ResponseEntity.ok(files);
    }

    public ResponseEntity<List<SharedFile>> searchFilesByNameAndReceiverId(String fileName, int senderId) {
        List<SharedFile> files = sharedFileRepo.findByFileNameContainingAndReceiverId(fileName, senderId);
        return ResponseEntity.ok(files);
    }

    public ResponseEntity<List<SharedFile>> getAllFiles() {
        List<SharedFile> files = sharedFileRepo.findAll();
        return ResponseEntity.ok(files);
    }
    public ResponseEntity<SharedFile> getFileById(int fileId) {
        SharedFile file = sharedFileRepo.findById(fileId).orElseThrow();
        return ResponseEntity.ok(file);
    }



}
