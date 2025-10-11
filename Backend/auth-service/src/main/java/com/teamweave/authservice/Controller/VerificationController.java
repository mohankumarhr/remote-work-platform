package com.teamweave.authservice.Controller;

import com.teamweave.authservice.Entity.OtpEntity;
import com.teamweave.authservice.Entity.Users;
import com.teamweave.authservice.Entity.VerificationToken;
import com.teamweave.authservice.Repo.OptRepo;
import com.teamweave.authservice.Repo.UserRepo;
import com.teamweave.authservice.Repo.VerificationTokenRepo;
import com.teamweave.authservice.Service.EmailService;
import com.teamweave.authservice.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/verification")
@CrossOrigin
public class VerificationController {
    @Autowired
    VerificationTokenRepo verificationTokenRepo;

    @Autowired
    UserRepo userRepo;

    @Autowired
    OptRepo otpRepo;

    @Autowired
    EmailService emailService;

    @Autowired
    UserService userService;

    @GetMapping("/verify")
    public ResponseEntity<Object> verifyAccount(@RequestParam("token") String token) {
        VerificationToken verificationToken = verificationTokenRepo.findByToken(token);

        if (verificationToken == null) {
            return new ResponseEntity<>("Invalid token", HttpStatus.NOT_ACCEPTABLE);
        }

        if (verificationToken.getExpirationTime().isBefore(LocalDateTime.now())) {
            return new ResponseEntity<>("Token expired", HttpStatus.NOT_ACCEPTABLE);
        }

        Users user = verificationToken.getUser();

        String response = userService.verifyUser(user); // Ensure user is registered before verification

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @GetMapping("/verifyotp")
    public ResponseEntity<Object> verifyOtp(@RequestParam("otp") String otp,
                                            @RequestParam("username") String username,
                                            @RequestParam("password") String password
    ) {
        OtpEntity optEntity = otpRepo.findByOtp(otp);
        if (optEntity == null || !optEntity.getUser().getUsername().equals(username)) {
            return new ResponseEntity<>("Invalid otp", HttpStatus.NOT_ACCEPTABLE);
        }
        if (optEntity.getExpirationTime().isBefore(LocalDateTime.now())) {
            return new ResponseEntity<>("otp expired", HttpStatus.NOT_ACCEPTABLE);
        }
        Users user = optEntity.getUser();
        user.setPassword(encoder.encode(password));
        userRepo.save(user);
        emailService.sendEmail(user.getEmail(), "Password Changed", "Your password has been changed");
        return new ResponseEntity<>("Otp verified successfully and password changed", HttpStatus.OK);
    }
}
