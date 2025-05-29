package com.gestionactivos.repository;

import com.gestionactivos.model.UsuarioSistema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioSistemaRepository extends JpaRepository<UsuarioSistema, Long> {
    Optional<UsuarioSistema> findByUsername(String username);
    Optional<UsuarioSistema> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}