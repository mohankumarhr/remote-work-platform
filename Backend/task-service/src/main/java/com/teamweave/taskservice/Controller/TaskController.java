package com.teamweave.taskservice.Controller;

import com.teamweave.taskservice.DTO.TaskDTO;
import com.teamweave.taskservice.Entity.Task;
import com.teamweave.taskservice.Entity.TaskPriority;
import com.teamweave.taskservice.Entity.TaskStatus;
import com.teamweave.taskservice.Service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/task")
@CrossOrigin
public class TaskController {

    @Autowired
    TaskService taskService;

    @PostMapping("/create")
    public ResponseEntity<String> createTask(@RequestBody Task task, @RequestParam int projectId) {
       return taskService.createTask(task, projectId);
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateTask(@RequestParam int taskId, @RequestBody Task task) {
        return taskService.updateTask(taskId, task);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteTask(@RequestParam int taskId) {
        return taskService.deleteTask(taskId);
    }

    @GetMapping("/get")
    public ResponseEntity<TaskDTO> getTaskById(@RequestParam int taskId) {
        return taskService.getTaskById(taskId);
    }

    @GetMapping("/all")
    public ResponseEntity<List<TaskDTO>> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/by-assigned-user")
    public ResponseEntity<List<TaskDTO>> getTasksByAssignedUserId(@RequestHeader("Authorization") String authHeader) {
            String token = authHeader.substring(7);
            int userId = taskService.getUserId(token);
        return taskService.getTasksByAssignedUserId(userId);
    }

    @GetMapping("/by-team")
    public ResponseEntity<List<TaskDTO>> getTasksByTeamId(@RequestParam int teamId) {
        return taskService.getTasksByTeamId(teamId);
    }

    @GetMapping("/by-status")
    public ResponseEntity<List<TaskDTO>> getTasksByStatus(@RequestParam TaskStatus status) {
        return taskService.getTasksByStatus(status);
    }

    @GetMapping("/by-status-and-user")
    public ResponseEntity<List<TaskDTO>> getTaskByStatusAndUserId(@RequestParam TaskStatus status, @RequestParam int userId) {
        return taskService.getTaskByStatusAndUserId(status, userId);
    }

    @GetMapping("/by-priority-and-user")
    public ResponseEntity<List<TaskDTO>> getTasksByPriorityAndUserId(@RequestParam TaskPriority priority, @RequestParam int userId) {
        return taskService.getTasksByPriorityAndUserId(priority, userId);
    }

    @GetMapping("/by-priority")
    public ResponseEntity<List<TaskDTO>> getTasksByPriority(@RequestParam TaskPriority priority) {
        return taskService.getTasksByPriority(priority);
    }

    @GetMapping("/by-due-date")
    public ResponseEntity<List<TaskDTO>> getTasksByDueDate(@RequestParam LocalDate dueDate) {
        return taskService.getTasksByDueDate(dueDate);
    }

    @GetMapping("/by-project")
    public ResponseEntity<List<TaskDTO>> getTasksByProjectId(@RequestParam int projectId) {
        return ResponseEntity.ok(taskService.getTasksByProjectId(projectId));
    }

    @PostMapping("/update-status")
    public ResponseEntity<String> updateTaskStatus(@RequestParam int taskId, @RequestParam TaskStatus status) {
        return taskService.updateTaskStatus(taskId, status);
    }

    @GetMapping("/by-owner")
    public ResponseEntity<List<TaskDTO>> getTasksByOwnerId(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        int ownerId = taskService.getUserId(token);
        List<TaskDTO> tasks = taskService.getTasksByOwnerId(ownerId);
        return ResponseEntity.ok(tasks);
    }

}
