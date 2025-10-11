package com.teamweave.userservice.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class UserProfile {

    @Id
    private int id;

    private String userName; // This can be used for login purposes
    private String fullName;
    private String email;
    private String role;
    private String designation;
    private String department;
    private String status; // online, offline, away
    private String profilePictureUrl;
    private long phoneNumber;

    public UserProfile() {
    }
    public UserProfile(int id, String fullName, String email, String role, String designation, String department, String status, String profilePictureUrl, String userName, long phoneNumber) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.designation = designation;
        this.department = department;
        this.status = status;
        this.profilePictureUrl = profilePictureUrl;
        this.userName = userName;
        this.phoneNumber = phoneNumber;
    }
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
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
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public long getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(long phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

}
