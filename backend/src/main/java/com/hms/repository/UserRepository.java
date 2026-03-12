package com.hms.repository;

import com.hms.entity.User;
import com.hms.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByRole(Role role);
    List<User> findByRoleAndSpecializationContainingIgnoreCase(Role role, String specialization);
    Optional<User> findByEmailAndPassword(String email, String password);
}

