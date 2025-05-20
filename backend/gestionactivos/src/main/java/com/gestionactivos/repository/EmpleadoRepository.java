package com.gestionactivos.repository;

import com.gestionactivos.model.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
    Optional<Empleado> findByNumeroDocumento(String numeroDocumento);
    Optional<Empleado> findByEmail(String email);
    List<Empleado> findByActivoTrue();
    boolean existsByNumeroDocumento(String numeroDocumento);
    boolean existsByEmail(String email);
}