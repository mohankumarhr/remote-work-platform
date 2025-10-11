package com.teamweave.taskservice.DTO;

import java.time.LocalDate;
import java.util.List;

public class ProjectDTO {
    private int id;
    private String name;
    private String description;
    private String subject;
    private int teamId;
    private LocalDate startDate;
    private List<TaskDTO> tasks;
    private int progress;
    private String status;
    private LocalDate dueDate;

    public ProjectDTO() {
    }

    public ProjectDTO(int id, String name, String description, String subject, int teamId, LocalDate startDate, List<TaskDTO> tasks, int progress, LocalDate dueDate, String status) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.subject = subject;
        this.teamId = teamId;
        this.startDate = startDate;
        this.tasks = tasks;
        this.progress = progress;
        this.dueDate = dueDate;
        this.status = status;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public int getTeamId() {
        return teamId;
    }

    public void setTeamId(int teamId) {
        this.teamId = teamId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    public List<TaskDTO> getTasks() {
        return tasks;
    }
    public void setTasks(List<TaskDTO> tasks) {
        this.tasks = tasks;
    }
    public int getProgress() {
        return progress;
    }
    public void setProgress(int progress) {
        this.progress = progress;
    }
    public LocalDate getDueDate() {
        return dueDate;
    }
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}
