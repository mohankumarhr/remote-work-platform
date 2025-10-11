package com.teamweave.teamservice.Service;

import com.localutil.Service.JwtService;
import com.teamweave.teamservice.DTO.UserDTO;
import com.teamweave.teamservice.Entity.Team;
import com.teamweave.teamservice.Entity.TeamMember;
import com.teamweave.teamservice.Repo.TeamMemberRepo;
import com.teamweave.teamservice.Repo.TeamRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class TeamService {

    @Autowired
    TeamRepo teamRepo;

    @Autowired
    TeamMemberRepo teamMemberRepo;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private JwtService jwtService;

    @Value("${user.service.url}")  
    private String userServiceUrl;

    public ResponseEntity<String> createTeam(Team team) {
        if (team.getName() == null || team.getName().isEmpty()) {
            return ResponseEntity.badRequest().body("Team name cannot be empty");
        }
        if (team.getOwnerId() <= 0) {
            return ResponseEntity.badRequest().body("Invalid owner ID");
        }
        teamRepo.save(team);
        TeamMember teamMember = new TeamMember();
        teamMember.setTeamId(team.getId());
        teamMember.setUserId(team.getOwnerId());
        teamMemberRepo.save(teamMember);
        return ResponseEntity.ok("Team created successfully");
    }


    public int isUserPresent(String username) {
        String url = userServiceUrl + "/userprofile/exists?username=" + username;

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "INTERNAL_SERVICE");

        String jwtToken = jwtService.generateToken("auth-service", claims);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + jwtToken);

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<Integer> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    requestEntity,
                    Integer.class
            );
            return response.getBody(); // Will return 0 if user doesn't exist
        } catch (RestClientException e) {
            throw new RuntimeException("Failed to fetch user ID: " + e.getMessage());
        }
    }

    public ResponseEntity<String> addMemberToTeam(String username, int teamId) {
        int userId = isUserPresent(username);
        System.out.println("User ID: " + userId);
        if (userId != 0){
            Team team = teamRepo.findById(teamId).orElse(null);
            if (team == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Team not found");
            }

            TeamMember teamMember = new TeamMember();
            teamMember.setTeamId(teamId);
            teamMember.setUserId(userId);
            teamMemberRepo.save(teamMember);

            return ResponseEntity.ok("Member added to team successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @Transactional
    public ResponseEntity<String> removeMemberFromTeam(int teamId, int userId) {
        try {
            int noOfRowAffected = teamMemberRepo.deleteTeamMemberByTeamIdAndUserId(teamId, userId);
            if (noOfRowAffected != 0) {
                return ResponseEntity.ok("Member removed from team successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Member not found in team");
            }
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error removing member from team: " + e.getMessage());
        }
    }

    public ResponseEntity<Team> getTeamDetails(int teamId) {
        Team team = teamRepo.findById(teamId).orElse(null);
        if (team == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(team);
    }


    public ResponseEntity<List<UserDTO>> getTeamMembers(int teamId) {
        List<TeamMember> teamMembers = teamMemberRepo.findByTeamId(teamId);
        if (teamMembers.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        List<Integer> memberIds = new ArrayList<>();
        for (TeamMember member : teamMembers) {
            memberIds.add(member.getUserId());
        }

        String url = userServiceUrl + "/userprofile/by-ids";

        // Step 3: Generate JWT token with internal role
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "INTERNAL_SERVICE");
        String jwtToken = jwtService.generateToken("team-service", claims);

        try {
            // Step 4: Prepare headers with JWT
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + jwtToken);

            // Step 5: Make request
            HttpEntity<List<Integer>> requestEntity = new HttpEntity<>(memberIds, headers);

            ResponseEntity<UserDTO[]> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestEntity,
                    UserDTO[].class
            );

            return ResponseEntity.ok(Arrays.asList(Objects.requireNonNull(response.getBody())));

        } catch (RestClientException e) {
            throw new RuntimeException("Failed to fetch user details: " + e.getMessage());
        }
    }


    public ResponseEntity<List<Team>> getAllTeams() {
    List<Team> teams = teamRepo.findAll();
        if (teams.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(teams);
    }

    public ResponseEntity<List<Team>> getTeamsByMember(int memberId) {
    List<TeamMember> teamMembers = teamMemberRepo.findByUserId(memberId);
        System.out.println(teamMembers);
//        if (teamMembers.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//        }
        List<Integer> teamIds = new ArrayList<>();
        for (TeamMember member : teamMembers) {
            teamIds.add(member.getTeamId());
        }

        List<Team> teams = teamRepo.findAllById(teamIds);
        return ResponseEntity.ok(teams);
    }

    public ResponseEntity<List<Team>> getTeamsByOwner(int ownerId) {
    List<Team> teams = teamRepo.findByOwnerId(ownerId);
        if (teams.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(teams);
    }

    public ResponseEntity<String> deleteTeam(int teamId) {
    Optional<Team> teamOptional = teamRepo.findById(teamId);
        if (teamOptional.isPresent()) {
            teamRepo.delete(teamOptional.get());
            return ResponseEntity.ok("Team deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Team not found");
        }
    }

    public ResponseEntity<String> updateTeam(int teamId, String newName) {
    Optional<Team> teamOptional = teamRepo.findById(teamId);
        if (teamOptional.isPresent()) {
            Team team = teamOptional.get();
            team.setName(newName);
            teamRepo.save(team);
            return ResponseEntity.ok("Team updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Team not found");
        }
    }

    public ResponseEntity<Team> getTeamById(int teamId) {
    Optional<Team> teamOptional = teamRepo.findById(teamId);
        return teamOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @Transactional
    public void removeUserFromAllTeams(Integer userId) {
        teamMemberRepo.deleteTeamMemberByUserId(userId);
    }

    public int getUserId(String token){
        return jwtService.extractClaim(token, claims -> claims.get("userId", Integer.class));
    }
}
