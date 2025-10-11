package com.teamweave.authservice.ResponseEntity;


import org.springframework.stereotype.Component;


@Component
public class LoginResponse {
    private String token;
    private String email;
    private boolean isEmailVerified;

    public LoginResponse() {
    }
    public LoginResponse(String token, String email, boolean isEmailVerified) {
        this.token = token;
        this.email = email;
        this.isEmailVerified = isEmailVerified;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean isEmailVerified() {
        return isEmailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        isEmailVerified = emailVerified;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
