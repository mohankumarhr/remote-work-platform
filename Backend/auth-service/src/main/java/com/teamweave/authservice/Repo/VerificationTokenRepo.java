package com.teamweave.authservice.Repo;

import com.teamweave.authservice.Entity.Users;
import com.teamweave.authservice.Entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationTokenRepo extends JpaRepository<VerificationToken, Long> {
    VerificationToken findByToken(String token);
    boolean existsByUser(Users user);
    VerificationToken findByUser(Users user);
}
