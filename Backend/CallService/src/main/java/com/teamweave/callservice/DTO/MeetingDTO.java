package com.teamweave.callservice.DTO;

import java.time.LocalDateTime;

public class MeetingDTO {

    private int id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private int duration; // in minutes
    private int organizerId;
    private int teamId;
    private String teamName;
    private String organizerName;

    public MeetingDTO() {
    }

    public MeetingDTO(int id, String title, String description, LocalDateTime startTime, int duration, int organizerId, int teamId, String teamName, String organizerName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.duration = duration;
        this.organizerId = organizerId;
        this.teamId = teamId;
        this.teamName = teamName;
        this.organizerName = organizerName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public int getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(int organizerId) {
        this.organizerId = organizerId;
    }

    public int getTeamId() {
        return teamId;
    }

    public void setTeamId(int teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getOrganizerName() {
        return organizerName;
    }

    public void setOrganizerName(String organizerName) {
        this.organizerName = organizerName;
    }
}
