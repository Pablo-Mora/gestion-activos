package com.example.activos_tic.domain.repository;

import com.example.activos_tic.domain.model.Hardware;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HardwareRepository extends JpaRepository<Hardware, Long> {
    Optional<Hardware> findBySerialNumber(String serialNumber);
    // Add custom queries if needed, e.g., findByType, findByAssignedEmployee
    List<Hardware> findByAssignedEmployee_Id(Long employeeId);
}
