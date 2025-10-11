package com.teamweave.userservice.DTO;

public class UserDeletedEvent {

    private String event = "USER_DELETED";
    private Integer userId;

    public UserDeletedEvent(Integer userId) {
        this.userId = userId;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
