package com.teamweave.taskservice.Service;

import com.localutil.Service.JwtService;
import com.teamweave.taskservice.DTO.NotificationKafkaEvent;
import com.teamweave.taskservice.DTO.TaskDTO;
import com.teamweave.taskservice.DTO.TeamDTO;
import com.teamweave.taskservice.Entity.Project;
import com.teamweave.taskservice.Entity.Task;
import com.teamweave.taskservice.Entity.TaskPriority;
import com.teamweave.taskservice.Entity.TaskStatus;
import com.teamweave.taskservice.Repo.ProjectRepo;
import com.teamweave.taskservice.Repo.TaskRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class TaskService {

    @Autowired
    TaskRepo taskRepo;

    @Autowired
    ProjectRepo projectRepo;

    @Autowired
    NotificationService notificationService;

    @Autowired
    RestTemplate restTemplate;

    @Autowired
    JwtService jwtService;

    @Value("${team.service.url}")
    private String teamServiceUrl;

    public ResponseEntity<String> createTask(Task task, int projectId) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
        task.setProject(project);
        taskRepo.save(task);
//        notificationService.notifyUser(
//                task.getAssignedToUserId(),
//                "New task assigned: " + task.getTitle(),
//                "TASK"
//        );
        return ResponseEntity.ok("Task created successfully");
    }

    public ResponseEntity<String> updateTask(int taskId, Task task) {
        if (taskRepo.existsById(taskId)) {
            task.setCreatedAt(taskRepo.findById(taskId).get().getCreatedAt()); // Preserve createdAt
            task.setId(taskId);
            if (taskRepo.findById(taskId).get().getStatus() != TaskStatus.COMPLETED && task.getStatus() == TaskStatus.COMPLETED) {
                task.setCompletedAt(LocalDate.now()); // Set completedAt if status is changed to COMPLETED
            }
            taskRepo.save(task);
            return ResponseEntity.ok("Task updated successfully");
        } else {
            return ResponseEntity.status(404).body("Task not found");
        }
    }


    public ResponseEntity<String> deleteTask(int taskId) {
        if (taskRepo.existsById(taskId)) {
            taskRepo.deleteById(taskId);
            return ResponseEntity.ok("Task deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Task not found");
        }
    }

    public ResponseEntity<TaskDTO> getTaskById(int taskId) {
        return taskRepo.findById(taskId)
                .map(task -> ResponseEntity.ok(toTaskDTO(task)))
                .orElseGet(() -> ResponseEntity.status(404).body(null));
    }

    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        List<Task> tasks = taskRepo.findAll();
        return ResponseEntity.ok(toTaskDTOList(tasks));
    }

    public ResponseEntity<List<TaskDTO>> getTasksByAssignedUserId(int userId) {
        List<Task> tasks = taskRepo.findTaskByAssignedToUserId(userId);
        return ResponseEntity.ok(toTaskDTOList(tasks));
    }

    public ResponseEntity<List<TaskDTO>> getTasksByTeamId(int teamId) {
        List<Task> tasks = taskRepo.findTaskByTeamId(teamId);
        return ResponseEntity.ok(toTaskDTOList(tasks));
    }


    public ResponseEntity<List<TaskDTO>> getTasksByStatus(TaskStatus status) {
        List<Task> tasks = taskRepo.findTaskByStatus(status);
        return ResponseEntity.ok(toTaskDTOList(tasks));
    }

    public ResponseEntity<List<TaskDTO>> getTaskByStatusAndUserId(TaskStatus status, int userId) {
        List<Task> tasks = taskRepo.findTaskByStatusAndAssignedToUserId(status, userId);
        return ResponseEntity.ok(toTaskDTOList(tasks));
    }

    public ResponseEntity<List<TaskDTO>> getTasksByPriorityAndUserId(TaskPriority priority, int userId) {
        List<Task> tasks = taskRepo.findTaskByPriorityAndAssignedToUserId(priority, userId);
        return ResponseEntity.ok(toTaskDTOList(tasks));
    }

    public ResponseEntity<List<TaskDTO>> getTasksByPriority(TaskPriority priority) {
        List<Task> tasks = taskRepo.findTaskByPriority(priority);
        return ResponseEntity.ok(toTaskDTOList(tasks));
    }

    public ResponseEntity<List<TaskDTO>> getTasksByDueDate(LocalDate dueDate) {
        List<Task> tasks = taskRepo.findTaskByDueDate(dueDate);
        return ResponseEntity.ok(toTaskDTOList(tasks));
    }

    private TaskDTO toTaskDTO(Task task) {
        if (task == null) return null;
        return new TaskDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getPriority(),
                task.getStatus(),
                task.getAssignedToUserId(),
                task.getCreatedByUserId(),
                task.getTeamId(),
                task.getCreatedAt(),
                task.getUpdatedAt(),
                task.getCompletedAt(),
                task.getProject() != null ? task.getProject().getId() : 0,
                task.getProject() != null ? task.getProject().getName() : null,
                getTeamName(task.getTeamId())
        );
    }

    private List<TaskDTO> toTaskDTOList(List<Task> tasks) {
        return tasks.stream()
                .map(this::toTaskDTO)
                .toList();
    }

    public List<TaskDTO> getTasksByProjectId(int projectId) {
        Project project = projectRepo.findById(projectId).orElse(null);
        List<Task> tasks = taskRepo.findByProject(project);
        return toTaskDTOList(tasks);
    }


    public String getTeamName(int teamId) {
        String url = teamServiceUrl + "/team/getbyid?teamId=" + teamId;
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

    public int getUserId(String token){
        return jwtService.extractClaim(token, claims -> claims.get("userId", Integer.class));
    }

    public ResponseEntity<String> updateTaskStatus(int taskId, TaskStatus status) {
        Task task = taskRepo.findById(taskId).orElse(null);
        if (task == null) {
            return ResponseEntity.status(404).body("Task not found");
        }
        task.setStatus(status);
        if (status == TaskStatus.COMPLETED) {
            task.setCompletedAt(LocalDate.now());
        }
        taskRepo.save(task);
        // Notify the user about the status update
        return ResponseEntity.ok("Task status updated successfully");
    }

    public List<TaskDTO> getTasksByOwnerId(int ownerId) {
        List<Task> tasks = taskRepo.findTaskByCreatedByUserId(ownerId);
        return toTaskDTOList(tasks);
    }

    @Transactional
    public String deleteTasksByTeamId(Integer teamId) {
        int deleted = taskRepo.deleteAllByTeamId(teamId);

        if (deleted == 0) {
            return "No tasks found for team ID: " + teamId;
        }

        return "Deleted " + deleted + " tasks for team ID: " + teamId;
    }
}
