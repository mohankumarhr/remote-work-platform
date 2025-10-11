package com.teamweave.teamservice.Controller;

import com.teamweave.teamservice.DTO.UserDTO;
import com.teamweave.teamservice.Entity.Team;
import com.teamweave.teamservice.Entity.TeamMember;
import com.teamweave.teamservice.Service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/team")
@CrossOrigin
public class TeamController {

    @Autowired
    TeamService teamService;

    @PostMapping("/create")
    public ResponseEntity<String> createTeam(@RequestBody Team team) {
        return teamService.createTeam(team);
    }

    @PostMapping("/addmember")
    public ResponseEntity<String> addMemberToTeam(@RequestParam String username, @RequestParam int teamId) {
        return teamService.addMemberToTeam(username, teamId);
    }

    @PostMapping("/removemember")
    public ResponseEntity<String> removeMemberFromTeam(@RequestParam int teamId, @RequestParam int userId) {
        return teamService.removeMemberFromTeam(teamId, userId);
    }

    @PostMapping("/exit")
    public ResponseEntity<String> exitFromTeam(@RequestParam int teamId, @RequestParam int memberId) {
        return teamService.removeMemberFromTeam(teamId, memberId);
    }

    @GetMapping("/details")
    public ResponseEntity<Team> getTeamDetails(@RequestParam int teamId) {
        return teamService.getTeamDetails(teamId);
    }

    @GetMapping("/members")
    public ResponseEntity<List<UserDTO>> getTeamMembers(@RequestParam int teamId) {
        return teamService.getTeamMembers(teamId);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Team>> getAllTeams() {
        return teamService.getAllTeams();
    }

    @GetMapping("/bymember")
    public ResponseEntity<List<Team>> getTeamsByMember(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        int memberId = teamService.getUserId(token);
        System.out.println(memberId);
        return teamService.getTeamsByMember(memberId);
    }

    @GetMapping("/byowner")
    public ResponseEntity<List<Team>> getTeamsByOwner(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        int ownerId = teamService.getUserId(token);
        return teamService.getTeamsByOwner(ownerId);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteTeam(@RequestParam int teamId) {
        return teamService.deleteTeam(teamId);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateTeam(@RequestParam int teamId, @RequestParam String newName) {
        return teamService.updateTeam(teamId, newName);
    }

//    @PreAuthorize("authentication.name == 'internal-service'")
    @GetMapping("/getbyid")
    public ResponseEntity<Team> getTeamById(@RequestParam int teamId) {
        return teamService.getTeamById(teamId);
    }

}
