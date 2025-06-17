package com.example.activos_tic.domain.repository;

import com.example.activos_tic.domain.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // Add custom queries if needed, e.g., findByDepartment
}
