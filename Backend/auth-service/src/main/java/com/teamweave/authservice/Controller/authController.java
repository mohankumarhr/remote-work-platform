package com.teamweave.authservice.Controller;

import com.teamweave.authservice.Entity.Users;
import com.teamweave.authservice.ResponseEntity.LoginResponse;
import com.teamweave.authservice.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class authController {

    @Autowired
    UserService userService;

    @RequestMapping("/register")
    public Users RegisterUser(@RequestBody Users user) {
        return userService.RegisterUser(user);
    }

    @RequestMapping("/login")
    public Map<String, LoginResponse> login(@RequestBody Users user) {
        LoginResponse result = userService.login(user);
        return Collections.singletonMap("response", result);
    }


    @GetMapping("/resendverification")
    public String ResendVerificationMail(@RequestParam String email) {
        return userService.ResendVerificationMail(email);
    }

    @GetMapping("/forgotpassword")
    public String ForgotPassword(@RequestParam String username) {
        return userService.ForgotPassword(username);
    }

    @GetMapping("/getUser")
    public Users getUserDetails(@RequestParam int id) {
        return userService.getUserDetails(id);
    }

}
