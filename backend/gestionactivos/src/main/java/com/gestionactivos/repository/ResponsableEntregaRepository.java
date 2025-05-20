package com.gestionactivos.repository;

import com.gestionactivos.model.ResponsableEntrega;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResponsableEntregaRepository extends JpaRepository<ResponsableEntrega, Long> {
    Optional<ResponsableEntrega> findByNumeroDocumento(String numeroDocumento);
    Optional<ResponsableEntrega> findByEmail(String email);
    List<ResponsableEntrega> findByActivoTrue();
    boolean existsByNumeroDocumento(String numeroDocumento);
    boolean existsByEmail(String email);
}