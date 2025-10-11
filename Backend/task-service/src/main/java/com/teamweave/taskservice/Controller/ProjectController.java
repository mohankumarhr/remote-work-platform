package com.teamweave.taskservice.Controller;

import com.teamweave.taskservice.DTO.ProjectDTO;
import com.teamweave.taskservice.DTO.TaskDTO;
import com.teamweave.taskservice.Entity.Project;
import com.teamweave.taskservice.Service.ProjectService;
import com.teamweave.taskservice.Service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;

@RestController
@RequestMapping("/project")
@CrossOrigin
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private TaskService taskService;

    @PostMapping("/create")
    public ResponseEntity<String> createProject(@RequestBody Project project) {
        return projectService.createProject(project);
    }

    @PutMapping("/update")
    private ResponseEntity<String> updateProject(@RequestParam int projectId, @RequestBody Project project) {
        return projectService.updateProject(projectId, project);
    }

    @DeleteMapping("/delete")
    private ResponseEntity<String> deleteProject(@RequestParam int projectId) {
        return projectService.deleteProject(projectId);
    }

    @GetMapping("/get")
    private ResponseEntity<ProjectDTO> getProjectById(@RequestParam int projectId) {
        return projectService.getProjectById(projectId);
    }

    @GetMapping("/all")
    private ResponseEntity<List<ProjectDTO>> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/by-team")
    private ResponseEntity<List<ProjectDTO>> getProjectsByTeamId(@RequestParam int teamId) {
        return projectService.getProjectsByTeamId(teamId);
    }

    @GetMapping("/by-owner")
    private ResponseEntity<List<ProjectDTO>> getProjectsByOwnerId(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        int ownerId = taskService.getUserId(token);
        List<TaskDTO> tasks = taskService.getTasksByOwnerId(ownerId);
        return projectService.getProjectsByOwnerId(ownerId);
    }


}
