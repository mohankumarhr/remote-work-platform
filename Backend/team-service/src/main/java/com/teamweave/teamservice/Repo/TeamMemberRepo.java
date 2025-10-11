package com.teamweave.teamservice.Repo;

import com.teamweave.teamservice.Entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamMemberRepo extends JpaRepository<TeamMember, Integer> {
    int deleteTeamMemberByTeamIdAndUserId(Integer teamId, Integer userId);

    List<TeamMember> findByTeamId(Integer teamId);

    List<TeamMember> findByUserId(int memberId);

    void deleteTeamMemberByUserId(int userId);
}
