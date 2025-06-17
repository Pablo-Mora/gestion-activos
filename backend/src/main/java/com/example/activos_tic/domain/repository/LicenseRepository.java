package com.example.activos_tic.domain.repository;

import com.example.activos_tic.domain.model.License;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LicenseRepository extends JpaRepository<License, Long> {
    Optional<License> findByLicenseKey(String licenseKey);
    // Add custom queries if needed, e.g., findBySoftwareName, findByAssignedEmployee
    List<License> findByAssignedEmployee_Id(Long employeeId);
}
