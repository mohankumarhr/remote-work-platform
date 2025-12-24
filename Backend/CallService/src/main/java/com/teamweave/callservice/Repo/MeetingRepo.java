package com.teamweave.callservice.Repo;

import com.teamweave.callservice.Entity.Meetings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingRepo extends JpaRepository<Meetings, Integer> {
    List<Meetings> findAllByTeamId(int teamId);
    List<Meetings> findAllByOrganizerId(int organizerId);
}
