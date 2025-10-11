package com.teamweave.authservice.Repo;

import com.teamweave.authservice.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<Users, Integer> {
    Users findByUsername(String username);
    // Additional query methods can be defined here if needed
}
