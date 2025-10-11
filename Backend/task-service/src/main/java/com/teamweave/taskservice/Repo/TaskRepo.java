package com.teamweave.taskservice.Repo;

import com.teamweave.taskservice.Entity.Project;
import com.teamweave.taskservice.Entity.Task;
import com.teamweave.taskservice.Entity.TaskPriority;
import com.teamweave.taskservice.Entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepo extends JpaRepository<Task, Integer> {
    List<Task> findTaskByAssignedToUserId(Integer userId);

    List<Task> findTaskByTeamId(int teamId);

    List<Task> findTaskByStatus(TaskStatus status);

    List<Task> findTaskByStatusAndAssignedToUserId(TaskStatus status, int userId);

    List<Task> findTaskByPriorityAndAssignedToUserId(TaskPriority priority, int userId);

    List<Task> findTaskByPriority(TaskPriority taskPriority);

    List<Task> findTaskByDueDate(LocalDate dueDate);

    List<Task> findByProject(Project project);

    List<Task> findByProjectAndStatus(Project project, TaskStatus status);

    List<Task> findTaskByCreatedByUserId(int userId);
}
