package com.teamweave.teamservice.DTO;

public class UserDTO {
    private int id;
    private String userName;
    private String fullName;
    private String email;
    private String role;
    private String designation;
    private String department;
    private String status; // online, offline, away
    private String profilePictureUrl;

    public UserDTO() {
    }

    public UserDTO(int id, String userName, String fullName, String email, String role, String designation, String department, String status, String profilePictureUrl) {
        this.id = id;
        this.userName = userName;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.designation = designation;
        this.department = department;
        this.status = status;
        this.profilePictureUrl = profilePictureUrl;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String username) {
        this.userName = username;
    }
    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
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
    public String getDesignation() {
        return designation;
    }
    public void setDesignation(String designation) {
        this.designation = designation;
    }
    public String getDepartment() {
        return department;
    }
    public void setDepartment(String department) {
        this.department = department;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }
    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

}
