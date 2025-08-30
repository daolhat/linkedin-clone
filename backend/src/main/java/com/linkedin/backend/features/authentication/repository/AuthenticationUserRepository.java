package com.linkedin.backend.features.authentication.repository;

import com.linkedin.backend.features.authentication.model.AuthenticationUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AuthenticationUserRepository extends JpaRepository<AuthenticationUser, Long> {

    Optional<AuthenticationUser> findByEmail(String email);

    List<AuthenticationUser> findAllByIdNot(Long id);
}
