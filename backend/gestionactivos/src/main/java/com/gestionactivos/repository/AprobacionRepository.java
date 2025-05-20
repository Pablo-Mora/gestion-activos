package com.gestionactivos.repository;

import com.gestionactivos.model.Acta;
import com.gestionactivos.model.Aprobacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AprobacionRepository extends JpaRepository<Aprobacion, Long> {
    Optional<Aprobacion> findByActa(Acta acta);
    boolean existsByActa(Acta acta);
}