package com.teamweave.teamservice.Repo;

import com.teamweave.teamservice.Entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepo extends JpaRepository<Team, Integer> {
    List<Team> findByOwnerId(int ownerId);
}
