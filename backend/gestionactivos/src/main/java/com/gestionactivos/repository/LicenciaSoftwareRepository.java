package com.gestionactivos.repository;

import com.gestionactivos.model.Empleado;
import com.gestionactivos.model.LicenciaSoftware;
import com.gestionactivos.model.enums.EstadoActivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LicenciaSoftwareRepository extends JpaRepository<LicenciaSoftware, Long> {
    Optional<LicenciaSoftware> findByCodigoLicencia(String codigoLicencia);
    List<LicenciaSoftware> findByEmpleado(Empleado empleado);
    List<LicenciaSoftware> findByEstado(EstadoActivo estado);
    boolean existsByCodigoLicencia(String codigoLicencia);
}