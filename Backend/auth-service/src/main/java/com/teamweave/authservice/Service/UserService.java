package com.teamweave.authservice.Service;

import com.teamweave.authservice.DTO.UserProfileDto;
import com.teamweave.authservice.Entity.Users;
import com.teamweave.authservice.Entity.VerificationToken;
import com.teamweave.authservice.Repo.UserRepo;
import com.teamweave.authservice.Repo.VerificationTokenRepo;
import com.teamweave.authservice.ResponseEntity.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class UserService {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepo userRepo;

    @Autowired
    JwtService jwtService;

    @Autowired
    VerificationTokenRepo verificationTokenRepo;

    @Autowired
    EmailService emailService;

    @Autowired
    OtpService otpService;

    @Autowired
    private RestTemplate restTemplate;

    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public Users RegisterUser(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(user);
        String token = UUID.randomUUID().toString();
        createVerificationToken(user, token);
        String url = "http://localhost:8081";

        String verificationLink = url + "/verification/verify?token=" + token;
        emailService.sendEmail(user.getEmail(), "Email Verification", "Click the link to verify your email: " + verificationLink);
        return user;
    }

    public LoginResponse login(Users user) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        Users full_user_details = userRepo.findByUsername(user.getUsername());
        System.out.println(full_user_details.isEmailVerified());
        LoginResponse response = new LoginResponse();
        if (authentication.isAuthenticated()) {
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", "EXTERNAL_SERVICE");
            claims.put("userId", full_user_details.getId());
            response.setToken(jwtService.generateToken(user.getUsername(), claims));
            response.setEmailVerified(full_user_details.isEmailVerified());
            response.setEmail(full_user_details.getEmail());
            return response;
        }else if (!full_user_details.isEmailVerified()) {
            response.setToken("failure");
            response.setEmailVerified(false);
            return response;
        }else {
            response.setToken("failure");
            response.setEmailVerified(false);
            return response;
        }
    }


    public String ResendVerificationMail(String email){
        Users user = userRepo.findUsersByEmail(email);

        if (user == null) {
            return "User with this email does not exist.";
        }

        if (user.isEmailVerified()) {
            return "User is already verified.";
        }

        // Check for an existing token
        VerificationToken verificationToken = verificationTokenRepo.findByUser(user);

        // Generate a new token if it doesn't exist or is expired
        if (verificationToken == null || verificationToken.getExpirationTime().isBefore(LocalDateTime.now())) {
            if(verificationToken !=null) {
                verificationTokenRepo.delete(verificationToken);
            }
            String newToken = UUID.randomUUID().toString();
            verificationToken = new VerificationToken();
            verificationToken.setToken(newToken);
            verificationToken.setUser(user);
            verificationToken.setExpirationTime(LocalDateTime.now().plusMinutes(10));
            verificationTokenRepo.save(verificationToken);
        }

        // Send the verification email
        String verificationLink = "http://localhost:8081/verification/verify?token=" + verificationToken.getToken();
        emailService.sendEmail(user.getEmail(), "Resend Email Verification", "Click the link to verify your email: " + verificationLink);

        return "Verification email resent successfully.";
    }


    public void createVerificationToken(Users user, String token) {
//        if(verificationTokenRepo.existsByUser(user)) {
//            VerificationToken verificationToken = verificationTokenRepo.findByUser(user);
//            verificationTokenRepo.delete(verificationToken);
//        }
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpirationTime(LocalDateTime.now().plusMinutes(10));
        verificationTokenRepo.save(verificationToken);
    }

    public String ForgotPassword(String username) {
        Users user = userRepo.findByUsername(username);
        if (user == null) {
            return "User with this username does not exist.";
        }
        return otpService.generateOtp(user);
    }

    public String verifyUser(Users user) {
        user.setEmailVerified(true);
        userRepo.save(user);

        try {
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", "INTERNAL_SERVICE");
            String token = jwtService.generateToken("auth-service", claims);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(token);
            System.out.println(token);

            UserProfileDto userProfileDto = new UserProfileDto();
            userProfileDto.setId(user.getId());
            userProfileDto.setEmail(user.getEmail());
            userProfileDto.setRole(user.getRole());
            userProfileDto.setUserName(user.getUsername());

            System.out.println(userProfileDto);

            HttpEntity<UserProfileDto> entity = new HttpEntity<>(userProfileDto, headers);

            String response = restTemplate.postForObject("http://localhost:8082/userprofile/create", entity, String.class);
            System.out.println("Response from user-service: " + response);

        } catch (Exception e) {
            // Optional: Log failure, or retry, or send to Dead Letter Queue (DLQ)
            System.out.println("Failed to create profile in user-service: " + e.getMessage());
        }

        return "Account verified successfully";
    }

    public Users getUserDetails(int id) {
        return userRepo.findById(id).orElse(null);
    }
}
