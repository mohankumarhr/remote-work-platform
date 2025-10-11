package com.teamweave.authservice.Repo;

import com.teamweave.authservice.Entity.OtpEntity;
import com.teamweave.authservice.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OptRepo extends JpaRepository<OtpEntity, Integer> {
    OtpEntity findByOtp(String otp);

    boolean existsByUser(Users user);

    OtpEntity findByUser(Users user);
}
