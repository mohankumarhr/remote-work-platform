package com.teamweave.authservice.Entity;

import jakarta.persistence.*;


import java.time.LocalDateTime;


@Entity
public class OtpEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String otp;
    private LocalDateTime expirationTime;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private Users user;

    public OtpEntity() {
    }
    public OtpEntity(int id, String otp, LocalDateTime expirationTime, Users user) {
        this.id = id;
        this.otp = otp;
        this.expirationTime = expirationTime;
        this.user = user;
    }
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getOtp() {
        return otp;
    }
    public void setOtp(String otp) {
        this.otp = otp;
    }
    public LocalDateTime getExpirationTime() {
        return expirationTime;
    }
    public void setExpirationTime(LocalDateTime expirationTime) {
        this.expirationTime = expirationTime;
    }
    public Users getUser() {
        return user;
    }
    public void setUser(Users user) {
        this.user = user;
    }


}
