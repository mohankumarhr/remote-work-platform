package com.teamweave.userservice.Service;

import com.localutil.Service.JwtService;
import com.teamweave.userservice.Entity.UserProfile;
import com.teamweave.userservice.Repo.UserProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserProfileService {

    @Autowired
    UserProfileRepo userProfileRepo;

    @Autowired
    JwtService jwtService;

    private final KafkaTemplate<String, Integer> kafkaTemplate;

    public UserProfileService(KafkaTemplate<String, Integer> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public String createUserProfile(UserProfile userProfile) {
        userProfileRepo.save(userProfile);
        return "User profile created";
    }

    public String updateUserProfile(int id, UserProfile userProfile) {
        if (userProfileRepo.existsById(id)) {
            userProfileRepo.save(userProfile);
            return "User profile updated";
        } else {
            return "User profile not found";
        }
    }

    public UserProfile getUserProfile(int id) {
        return userProfileRepo.findById(id).orElse(null);
    }

    public List<UserProfile> getAllUserProfiles() {
        return userProfileRepo.findAll();
    }

    public int existsByUsername(String username) {
        if (userProfileRepo.existsUserProfileByUserName(username)){
            return userProfileRepo.findUserProfileByUserName(username).getId();
        }else {
            return 0;
        }
    }

    public List<UserProfile> getUsersByIds(List<Integer> ids) {
        List<UserProfile> users = userProfileRepo.findAllById(ids);

        return users.stream()
                .map(user -> new UserProfile(user.getId(), user.getFullName(), user.getEmail(), user.getRole(), user.getDesignation(), user.getDepartment(), user.getStatus(), user.getProfilePictureUrl(), user.getUserName(), user.getPhoneNumber())) // Adjust fields as needed
                .collect(Collectors.toList());
    }

    public ResponseEntity<String> deleteUserProfile(int id) {
        if (userProfileRepo.existsById(id)) {
            userProfileRepo.deleteById(id);
            kafkaTemplate.send("user-events", id);
            return ResponseEntity.ok("User profile deleted successfully");
        } else {
            return ResponseEntity.status(404).body("User profile not found");
        }
    }

    public int getUserId(String token){
        return jwtService.extractClaim(token, claims -> claims.get("userId", Integer.class));
    }

}
