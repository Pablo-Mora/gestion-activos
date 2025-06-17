package com.example.activos_tic.domain.repository;

import com.example.activos_tic.domain.model.WebAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebAccessRepository extends JpaRepository<WebAccess, Long> {
    // Add custom queries if needed, e.g., findByServiceName, findByAssignedEmployee
    List<WebAccess> findByAssignedEmployee_Id(Long employeeId);
}
