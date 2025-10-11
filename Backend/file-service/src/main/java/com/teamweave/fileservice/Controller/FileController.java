package com.teamweave.fileservice.Controller;

import com.teamweave.fileservice.Entity.SharedFile;
import com.teamweave.fileservice.Service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/files")
@CrossOrigin
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<SharedFile> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam int senderId,
            @RequestParam(required = false, defaultValue = "0") int receiverId,
            @RequestParam(required = false, defaultValue = "0") int teamId) throws IOException {
        return ResponseEntity.ok(fileService.uploadFile(file, senderId, receiverId, teamId));
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable int fileId) throws IOException {
        return fileService.downloadFile(fileId);
    }

    @DeleteMapping("/delete/{fileId}")
    public ResponseEntity<String> deleteFile(@PathVariable int fileId) throws IOException {
        fileService.deleteFile(fileId);
        return ResponseEntity.ok("File deleted successfully");
    }

    @GetMapping("/ByReceiverId")
    public ResponseEntity<List<SharedFile>> getFilesByReceiverId(@RequestParam int receiverId) {
        return fileService.getFilesByReceiverId(receiverId);
    }

    @GetMapping("/BySenderId")
    public ResponseEntity<List<SharedFile>> getFilesBySenderId(@RequestParam int senderId) {
        return fileService.getFilesBySenderId(senderId);
    }

    @GetMapping("/ByReceiverAndSenderId")
    public ResponseEntity<List<SharedFile>> getFilesByReceiverAndSenderId(@RequestParam int receiverId, @RequestParam int senderId) {
        return fileService.getFilesByReceiverIdAndSenderId(receiverId, senderId);
    }

    @GetMapping("/ByTeamId")
    public ResponseEntity<List<SharedFile>> getFilesByTeamId(@RequestParam int teamId) {
        return fileService.getFilesByTeamId(teamId);
    }

    @GetMapping("/searchByNameAndTeamId")
    public ResponseEntity<List<SharedFile>> searchFilesByNameAndTeamId(@RequestParam String fileName, @RequestParam int teamId) {
        return fileService.searchFilesByNameAndTeamId(fileName, teamId);
    }

    @GetMapping("/searchByNameAndReceiverId")
    public ResponseEntity<List<SharedFile>> searchFilesByNameAndReceiverId(@RequestParam
    String fileName, @RequestParam int receiverId) {
        return fileService.searchFilesByNameAndReceiverId(fileName, receiverId);
    }

    @GetMapping("/all")
    public ResponseEntity<List<SharedFile>> getAllFiles() {
        return fileService.getAllFiles();
    }

    @GetMapping("/fileById")
    public ResponseEntity<SharedFile> getFileById(@RequestParam int fileId) {
        return fileService.getFileById(fileId);
    }


}
