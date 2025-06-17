package com.example.activos_tic.domain.repository;

import com.example.activos_tic.domain.model.ERole;
import com.example.activos_tic.domain.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}
