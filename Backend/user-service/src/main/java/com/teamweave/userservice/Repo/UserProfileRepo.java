package com.teamweave.userservice.Repo;

import com.teamweave.userservice.Entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProfileRepo extends JpaRepository<UserProfile, Integer> {
    boolean existsUserProfileByUserName(String username);
    UserProfile findUserProfileByUserName(String username);
}
