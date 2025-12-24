package com.teamweave.authservice.Entity;

import jakarta.persistence.*;


@Entity
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false)
    private String username;
    private String password;

    @Column(unique = true, nullable = false)
    private String email;
    private boolean emailVerified = false;
    private String role; // e.g., "USER", "ADMIN", etc.

    // Additional fields and methods can be added as needed


    public Users() {
    }

    public Users(int id, String username, String password, String email, boolean emailVerified, String role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.emailVerified = emailVerified;
        this.role = role;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
