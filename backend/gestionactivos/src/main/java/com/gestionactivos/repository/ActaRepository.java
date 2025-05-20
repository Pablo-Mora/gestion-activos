package com.gestionactivos.repository;

import com.gestionactivos.model.Acta;
import com.gestionactivos.model.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActaRepository extends JpaRepository<Acta, Long> {
    Optional<Acta> findByNumeroActa(String numeroActa);
    List<Acta> findByEmpleado(Empleado empleado);
    List<Acta> findByTipoActa(String tipoActa);
    boolean existsByNumeroActa(String numeroActa);
}