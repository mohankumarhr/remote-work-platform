package com.teamweave.taskservice.Repo;

import com.teamweave.taskservice.DTO.ProjectDTO;
import com.teamweave.taskservice.Entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepo extends JpaRepository<Project, Integer> {
    List<Project> findByTeamId(int teamId);
    List<Project> findByOwnerId(int userId);
}
