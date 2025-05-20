package com.gestionactivos.repository;

import com.gestionactivos.model.ActivoHardware;
import com.gestionactivos.model.Empleado;
import com.gestionactivos.model.enums.EstadoActivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivoHardwareRepository extends JpaRepository<ActivoHardware, Long> {
    Optional<ActivoHardware> findByNumeroSerie(String numeroSerie);
    Optional<ActivoHardware> findByCodigoInventario(String codigoInventario);
    List<ActivoHardware> findByEmpleado(Empleado empleado);
    List<ActivoHardware> findByEstado(EstadoActivo estado);
    boolean existsByNumeroSerie(String numeroSerie);
    boolean existsByCodigoInventario(String codigoInventario);
}