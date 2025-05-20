package com.gestionactivos.repository;

import com.gestionactivos.model.AccesoWeb;
import com.gestionactivos.model.Empleado;
import com.gestionactivos.model.enums.EstadoActivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccesoWebRepository extends JpaRepository<AccesoWeb, Long> {
    List<AccesoWeb> findByEmpleado(Empleado empleado);
    List<AccesoWeb> findByEstado(EstadoActivo estado);
    List<AccesoWeb> findByNombreContainingIgnoreCase(String nombre);
}