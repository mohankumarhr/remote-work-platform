package com.teamweave.authservice.DTO;

public class UserProfileDto {

    private int id;
    private String userName;
    private String email;
    private String role;

    public UserProfileDto() {
    }
    public UserProfileDto(int id, String email, String role, String username) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.userName = username;
    }
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }

    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
}
