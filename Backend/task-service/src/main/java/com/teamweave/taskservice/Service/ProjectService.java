package com.teamweave.taskservice.Service;

import com.teamweave.taskservice.DTO.ProjectDTO;
import com.teamweave.taskservice.DTO.TaskDTO;
import com.teamweave.taskservice.Entity.Project;
import com.teamweave.taskservice.Entity.Task;
import com.teamweave.taskservice.Entity.TaskStatus;
import com.teamweave.taskservice.Repo.ProjectRepo;
import com.teamweave.taskservice.Repo.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.time.temporal.ChronoUnit;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepo projectRepo;

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskRepo taskRepo;

    public ResponseEntity<String> createProject(Project project) {
        try {
            projectRepo.save(project);
            return ResponseEntity.ok("Project created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating project: " + e.getMessage());
        }
    }


    public ResponseEntity<String> updateProject(int projectId, Project project) {
        try {
            if (projectRepo.existsById(projectId)) {
                Project oldproject = projectRepo.findById(projectId).orElse(null);
                if (oldproject == null) {
                    return ResponseEntity.status(404).body("Project not found");
                }
                project.setStartDate(oldproject.getStartDate());
                project.setId(projectId);
                projectRepo.save(project);
                return ResponseEntity.ok("Project updated successfully");
            } else {
                return ResponseEntity.status(404).body("Project not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating project: " + e.getMessage());
        }
    }

    public ResponseEntity<String> deleteProject(int projectId) {
        try {
            if (projectRepo.existsById(projectId)) {
                projectRepo.deleteById(projectId);
                return ResponseEntity.ok("Project deleted successfully");
            } else {
                return ResponseEntity.status(404).body("Project not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting project: " + e.getMessage());
        }
    }


    public ResponseEntity<ProjectDTO> getProjectById(int projectId) {
        try {
            ProjectDTO projectDTO = new ProjectDTO();
            Project project = projectRepo.findById(projectId).orElse(null);
            if (project == null) {
                return ResponseEntity.status(404).body(null);
            }
            projectDTO.setId(project.getId());
            projectDTO.setName(project.getName());
            projectDTO.setDescription(project.getDescription());
            projectDTO.setSubject(project.getSubject());
            projectDTO.setTeamId(project.getTeamId());
            projectDTO.setStartDate(project.getStartDate());
            projectDTO.setDueDate(project.getDueDate());
            List<TaskDTO> tasks = taskService.getTasksByProjectId(project.getId());
            projectDTO.setTasks(tasks);
            int progress = calculateProgress(tasks);
            projectDTO.setProgress(progress);
            String status = getStatus(progress, project.getStartDate(), project.getDueDate());
            projectDTO.setStatus(status);

            return ResponseEntity.ok(projectDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }


    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        try {
            List<Project> projects = projectRepo.findAll();
            if (projects.isEmpty()) {
                return ResponseEntity.status(404).body(null);
            }
            return getListResponseEntity(projects);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    public ResponseEntity<List<ProjectDTO>> getProjectsByTeamId(int teamId) {
        try {
            List<Project> projects = projectRepo.findByTeamId(teamId);
            return getListResponseEntity(projects);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    private ResponseEntity<List<ProjectDTO>> getListResponseEntity(List<Project> projects) {
        List<ProjectDTO> projectDTOs = projects.stream().map(project -> {
            ProjectDTO dto = new ProjectDTO();
            dto.setId(project.getId());
            dto.setName(project.getName());
            dto.setDescription(project.getDescription());
            dto.setSubject(project.getSubject());
            dto.setTeamId(project.getTeamId());
            dto.setStartDate(project.getStartDate());
            dto.setDueDate(project.getDueDate());
            List<TaskDTO> tasks = taskService.getTasksByProjectId(project.getId());
            dto.setTasks(tasks);
            int progress = calculateProgress(tasks);
            dto.setProgress(progress);
            String status = getStatus(progress, project.getStartDate(), project.getDueDate());
            dto.setStatus(status);
            return dto;
        }).toList();
        return ResponseEntity.ok(projectDTOs);
    }

    public ResponseEntity<List<ProjectDTO>> getProjectsByOwnerId(int ownerId) {
        List<Project> projects = projectRepo.findByOwnerId(ownerId);
        return getListResponseEntity(projects);
    }

    private String getStatus(int progress, LocalDate startDate, LocalDate dueDate) {
        if (startDate == null || dueDate == null) {
            return "invalidDates";  // or handle gracefully
        }

        LocalDate currentDate = LocalDate.now();
        long totalDays = ChronoUnit.DAYS.between(startDate, dueDate);
        if (totalDays == 0) {
            return "invalidDates";  // Or handle this case as needed (e.g., if it's an error or edge case)
        }

        long daysPassed = ChronoUnit.DAYS.between(startDate, currentDate);
        long percentage = 0;
        if (daysPassed > 0) {
            percentage = daysPassed / totalDays * 100;
        }

        if (progress == percentage) {
            return "onTrack";
        } else if (progress < percentage) {
            return "delayed";
        } else if (progress == 0 && percentage > 50) {
            return "atRisk";
        } else {
            return "ahead";
        }
    }


    private int calculateProgress(List<TaskDTO> tasks) {
        if (tasks.isEmpty()) return 0;
        long completedTasks = tasks.stream().filter(task -> task.getStatus() == TaskStatus.COMPLETED).count();
        return (int) ((completedTasks * 100) / tasks.size());
    }
}



