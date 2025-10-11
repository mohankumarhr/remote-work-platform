package com.teamweave.userservice.Controller;


import com.teamweave.userservice.Entity.UserProfile;
import com.teamweave.userservice.Service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/userprofile")
@CrossOrigin
public class UserProfileController {

    @Autowired
    UserProfileService userProfileService;

    @PreAuthorize("authentication.name == 'internal-service'")
    @PostMapping("/create")
    public String createUserProfile(@RequestBody UserProfile userProfile) {
        return userProfileService.createUserProfile(userProfile);
    }

    @PutMapping("/update")
    public String updateUserProfile(@RequestParam int id, @RequestBody UserProfile userProfile) {
        return userProfileService.updateUserProfile(id, userProfile);
    }

    @GetMapping("/get")
    public UserProfile getUserProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        int userId = userProfileService.getUserId(token);
        return userProfileService.getUserProfile(userId); // Replace with actual retrieval logic
    }

    @GetMapping("/getall")
    public List<UserProfile> getAllUserProfiles() {
        return userProfileService.getAllUserProfiles(); // Replace with actual retrieval logic
    }

    @GetMapping("/exists")
    public ResponseEntity<Integer> checkUserExists(@RequestParam String username) {
        int exists = userProfileService.existsByUsername(username);
        return ResponseEntity.ok(exists);
    }

    @PostMapping("/by-ids")
    public List<UserProfile> getUsersByIds(@RequestBody List<Integer> ids) {
        return userProfileService.getUsersByIds(ids);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUserProfile(@RequestParam int id) {
        return userProfileService.deleteUserProfile(id);
    }
}
