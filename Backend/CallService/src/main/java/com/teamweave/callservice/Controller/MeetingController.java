package com.teamweave.callservice.Controller;


import com.teamweave.callservice.DTO.MeetingDTO;
import com.teamweave.callservice.Entity.Meetings;
import com.teamweave.callservice.Service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/meeting")
@CrossOrigin
public class MeetingController {

    @Autowired
    private MeetingService meetingService;

    @PostMapping("/create")
    public ResponseEntity<String> createMeeting(@RequestBody Meetings meeting) {
        return meetingService.createMeeting(meeting);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateMeeting(@RequestBody Meetings meeting) {
        return meetingService.updateMeeting(meeting);
    }

    @GetMapping("/details")
    public ResponseEntity<Meetings> getMeetingDetailsById(@RequestParam int meetingId) {
        return meetingService.getMeetingDetailsById(meetingId);
    }

    @GetMapping("/byTeam")
    public ResponseEntity<List<MeetingDTO>> getMeetingByTeamId(@RequestParam int teamId) {
        return meetingService.getMeetingByTeamId(teamId);
    }

    @GetMapping("/byOrganizer")
    public ResponseEntity<List<Meetings>> getMeetingsByOrganizerId(@RequestParam int organizerId) {
        return meetingService.getMeetingByOrganizerId(organizerId);
    }


}
