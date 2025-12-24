package com.teamweave.callservice.Service;

import com.localutil.Service.JwtService;
import com.teamweave.callservice.DTO.MeetingDTO;
import com.teamweave.callservice.DTO.TeamDTO;
import com.teamweave.callservice.Entity.Meetings;
import com.teamweave.callservice.Repo.MeetingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class MeetingService {

    @Value("${team.service.url}")
    private String teamServiceUrl;

    @Autowired
    MeetingRepo meetingRepo;

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    JwtService jwtService;

    public ResponseEntity<String> createMeeting(Meetings meeting) {
        meetingRepo.save(meeting);
        return ResponseEntity.ok("Meeting created successfully");
    }

    public ResponseEntity<String> updateMeeting(Meetings meeting) {
        meetingRepo.save(meeting);
        return ResponseEntity.ok("Meeting updated successfully");
    }

    public ResponseEntity<Meetings> getMeetingDetailsById(int meetingId) {
        Meetings meeting = meetingRepo.findById(meetingId).orElse(null);
        return ResponseEntity.ok(meeting);
    }

    public ResponseEntity<List<MeetingDTO>> getMeetingByTeamId(int teamId) {
        List<Meetings> meetings = meetingRepo.findAllByTeamId(teamId);
        return ResponseEntity.ok(MeetingsToMeetingDTOList(meetings));
    }

    public ResponseEntity<List<Meetings>> getMeetingByOrganizerId(int organizerId) {
        List<Meetings> meetings = meetingRepo.findAllByOrganizerId(organizerId);
        return ResponseEntity.ok(meetings);
    }

    public String getTeamName(int teamId) {
        String url = teamServiceUrl + "team/getbyid?teamId=" + teamId;
        System.out.println(url);

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "INTERNAL_SERVICE");
        String jwtToken = jwtService.generateToken("task-service", claims);
        System.out.println("Generated JWT Token: " + jwtToken);
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + jwtToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<TeamDTO> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                TeamDTO.class
        );

        return Objects.requireNonNull(response.getBody()).getName();
    }

    public List<MeetingDTO> MeetingsToMeetingDTOList(List<Meetings> meetings) {
        return meetings.stream()
                .map(this::MeetingToMeetingDTO)
                .toList();
    }

    private MeetingDTO MeetingToMeetingDTO(Meetings meetings) {
        if (meetings == null) return null;
        return new MeetingDTO(
                meetings.getId(),
                meetings.getTitle(),
                meetings.getDescription(),
                meetings.getStartTime(),
                meetings.getDuration(),
                meetings.getOrganizerId(),
                meetings.getTeamId(),
                getTeamName(meetings.getTeamId()),
                getOrganizerName(meetings.getOrganizerId())
        );
    }

    private String getOrganizerName(int organizerId) {
        return "";
    }

}
