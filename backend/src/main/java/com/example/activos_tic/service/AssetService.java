package com.example.activos_tic.service;

import com.example.activos_tic.domain.model.Employee;
import com.example.activos_tic.domain.model.Hardware;
import com.example.activos_tic.domain.model.License;
import com.example.activos_tic.domain.model.WebAccess;
import com.example.activos_tic.domain.repository.EmployeeRepository;
import com.example.activos_tic.domain.repository.HardwareRepository;
import com.example.activos_tic.domain.repository.LicenseRepository;
import com.example.activos_tic.domain.repository.WebAccessRepository;
import com.example.activos_tic.dto.EmployeeDto;
import com.example.activos_tic.dto.HardwareDto;
import com.example.activos_tic.dto.LicenseDto;
import com.example.activos_tic.dto.WebAccessDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssetService {

    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private HardwareRepository hardwareRepository;
    @Autowired
    private LicenseRepository licenseRepository;
    @Autowired
    private WebAccessRepository webAccessRepository;

    // --- Employee Methods ---
    @Transactional
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        Employee employee = mapToEmployeeEntity(employeeDto);
        employee = employeeRepository.save(employee);
        return mapToEmployeeDto(employee);
    }

    @Transactional(readOnly = true)
    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::mapToEmployeeDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + id));
        return mapToEmployeeDto(employee);
    }

    @Transactional
    public EmployeeDto updateEmployee(Long id, EmployeeDto employeeDto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + id));
        employee.setName(employeeDto.getName());
        employee.setDepartment(employeeDto.getDepartment());
        employee.setPosition(employeeDto.getPosition());
        employee = employeeRepository.save(employee);
        return mapToEmployeeDto(employee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new EntityNotFoundException("Employee not found with id: " + id);
        }
        // Consider implications: what happens to assets assigned to this employee?
        // For now, we'll just delete the employee.
        // Unassign assets before deleting or handle it via database constraints (SET NULL or CASCADE if appropriate)
        hardwareRepository.findByAssignedEmployee_Id(id).forEach(h -> {
            h.setAssignedEmployee(null);
            hardwareRepository.save(h);
        });
        licenseRepository.findByAssignedEmployee_Id(id).forEach(l -> {
            l.setAssignedEmployee(null);
            licenseRepository.save(l);
        });
        webAccessRepository.findByAssignedEmployee_Id(id).forEach(w -> {
            w.setAssignedEmployee(null);
            webAccessRepository.save(w);
        });

        employeeRepository.deleteById(id);
    }

    // --- Hardware Methods ---
    @Transactional
    public HardwareDto createHardware(HardwareDto hardwareDto) {
        Hardware hardware = mapToHardwareEntity(hardwareDto);
        hardware = hardwareRepository.save(hardware);
        return mapToHardwareDto(hardware);
    }

    @Transactional(readOnly = true)
    public List<HardwareDto> getAllHardware() {
        return hardwareRepository.findAll().stream()
            .map(this::mapToHardwareDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HardwareDto getHardwareById(Long id) {
        Hardware hardware = hardwareRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Hardware not found: " + id));
        return mapToHardwareDto(hardware);
    }

    @Transactional
    public HardwareDto updateHardware(Long id, HardwareDto hardwareDto) {
        Hardware hardware = hardwareRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Hardware not found: " + id));
        hardware.setType(hardwareDto.getType());
        hardware.setBrand(hardwareDto.getBrand());
        hardware.setSerialNumber(hardwareDto.getSerialNumber());
        hardware.setLocation(hardwareDto.getLocation());
        if (hardwareDto.getAssignedEmployeeId() != null) {
            Employee employee = employeeRepository.findById(hardwareDto.getAssignedEmployeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found for assignment: " + hardwareDto.getAssignedEmployeeId()));
            hardware.setAssignedEmployee(employee);
        } else {
            hardware.setAssignedEmployee(null);
        }
        hardware = hardwareRepository.save(hardware);
        return mapToHardwareDto(hardware);
    }

    @Transactional
    public void deleteHardware(Long id) {
        if (!hardwareRepository.existsById(id)) {
            throw new EntityNotFoundException("Hardware not found: " + id);
        }
        hardwareRepository.deleteById(id);
    }

    // --- License Methods ---
    @Transactional
    public LicenseDto createLicense(LicenseDto licenseDto) {
        License license = mapToLicenseEntity(licenseDto);
        license = licenseRepository.save(license);
        return mapToLicenseDto(license);
    }

    @Transactional(readOnly = true)
    public List<LicenseDto> getAllLicenses() {
        return licenseRepository.findAll().stream()
            .map(this::mapToLicenseDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LicenseDto getLicenseById(Long id) {
        License license = licenseRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("License not found: " + id));
        return mapToLicenseDto(license);
    }

    @Transactional
    public LicenseDto updateLicense(Long id, LicenseDto licenseDto) {
        License license = licenseRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("License not found: " + id));
        license.setSoftwareName(licenseDto.getSoftwareName());
        license.setLicenseKey(licenseDto.getLicenseKey());
        license.setPurchaseDate(licenseDto.getPurchaseDate());
        license.setExpirationDate(licenseDto.getExpirationDate());
        if (licenseDto.getAssignedEmployeeId() != null) {
            Employee employee = employeeRepository.findById(licenseDto.getAssignedEmployeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found for assignment: " + licenseDto.getAssignedEmployeeId()));
            license.setAssignedEmployee(employee);
        } else {
            license.setAssignedEmployee(null);
        }
        license = licenseRepository.save(license);
        return mapToLicenseDto(license);
    }

    @Transactional
    public void deleteLicense(Long id) {
        if (!licenseRepository.existsById(id)) {
            throw new EntityNotFoundException("License not found: " + id);
        }
        licenseRepository.deleteById(id);
    }

    // --- WebAccess Methods ---
    @Transactional
    public WebAccessDto createWebAccess(WebAccessDto webAccessDto) {
        WebAccess webAccess = mapToWebAccessEntity(webAccessDto);
        webAccess = webAccessRepository.save(webAccess);
        return mapToWebAccessDto(webAccess);
    }

    @Transactional(readOnly = true)
    public List<WebAccessDto> getAllWebAccesses() {
        return webAccessRepository.findAll().stream()
            .map(this::mapToWebAccessDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WebAccessDto getWebAccessById(Long id) {
        WebAccess webAccess = webAccessRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("WebAccess not found: " + id));
        return mapToWebAccessDto(webAccess);
    }

    @Transactional
    public WebAccessDto updateWebAccess(Long id, WebAccessDto webAccessDto) {
        WebAccess webAccess = webAccessRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("WebAccess not found: " + id));
        webAccess.setUrl(webAccessDto.getUrl());
        webAccess.setServiceName(webAccessDto.getServiceName());
        webAccess.setAccessUsername(webAccessDto.getAccessUsername());
        webAccess.setAccessPassword(webAccessDto.getAccessPassword()); // Consider re-encryption if password changes
        if (webAccessDto.getAssignedEmployeeId() != null) {
            Employee employee = employeeRepository.findById(webAccessDto.getAssignedEmployeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found for assignment: " + webAccessDto.getAssignedEmployeeId()));
            webAccess.setAssignedEmployee(employee);
        } else {
            webAccess.setAssignedEmployee(null);
        }
        webAccess = webAccessRepository.save(webAccess);
        return mapToWebAccessDto(webAccess);
    }

    @Transactional
    public void deleteWebAccess(Long id) {
        if (!webAccessRepository.existsById(id)) {
            throw new EntityNotFoundException("WebAccess not found: " + id);
        }
        webAccessRepository.deleteById(id);
    }


    // --- Private Mapper Methods ---
    private EmployeeDto mapToEmployeeDto(Employee employee) {
        EmployeeDto dto = new EmployeeDto();
        dto.setId(employee.getId());
        dto.setName(employee.getName());
        dto.setDepartment(employee.getDepartment());
        dto.setPosition(employee.getPosition());
        return dto;
    }

    private Employee mapToEmployeeEntity(EmployeeDto dto) {
        Employee employee = new Employee();
        // ID is not set for new entities
        employee.setName(dto.getName());
        employee.setDepartment(dto.getDepartment());
        employee.setPosition(dto.getPosition());
        return employee;
    }

    private HardwareDto mapToHardwareDto(Hardware hardware) {
        HardwareDto dto = new HardwareDto();
        dto.setId(hardware.getId());
        dto.setType(hardware.getType());
        dto.setBrand(hardware.getBrand());
        dto.setSerialNumber(hardware.getSerialNumber());
        dto.setLocation(hardware.getLocation());
        if (hardware.getAssignedEmployee() != null) {
            dto.setAssignedEmployeeId(hardware.getAssignedEmployee().getId());
            dto.setAssignedEmployeeName(hardware.getAssignedEmployee().getName());
        }
        return dto;
    }

    private Hardware mapToHardwareEntity(HardwareDto dto) {
        Hardware hardware = new Hardware();
        hardware.setType(dto.getType());
        hardware.setBrand(dto.getBrand());
        hardware.setSerialNumber(dto.getSerialNumber());
        hardware.setLocation(dto.getLocation());
        if (dto.getAssignedEmployeeId() != null) {
            Employee employee = employeeRepository.findById(dto.getAssignedEmployeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found for hardware assignment: " + dto.getAssignedEmployeeId()));
            hardware.setAssignedEmployee(employee);
        }
        return hardware;
    }

    private LicenseDto mapToLicenseDto(License license) {
        LicenseDto dto = new LicenseDto();
        dto.setId(license.getId());
        dto.setSoftwareName(license.getSoftwareName());
        dto.setLicenseKey(license.getLicenseKey());
        dto.setPurchaseDate(license.getPurchaseDate());
        dto.setExpirationDate(license.getExpirationDate());
        if (license.getAssignedEmployee() != null) {
            dto.setAssignedEmployeeId(license.getAssignedEmployee().getId());
            dto.setAssignedEmployeeName(license.getAssignedEmployee().getName());
        }
        return dto;
    }

    private License mapToLicenseEntity(LicenseDto dto) {
        License license = new License();
        license.setSoftwareName(dto.getSoftwareName());
        license.setLicenseKey(dto.getLicenseKey());
        license.setPurchaseDate(dto.getPurchaseDate());
        license.setExpirationDate(dto.getExpirationDate());
        if (dto.getAssignedEmployeeId() != null) {
            Employee employee = employeeRepository.findById(dto.getAssignedEmployeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found for license assignment: " + dto.getAssignedEmployeeId()));
            license.setAssignedEmployee(employee);
        }
        return license;
    }

    private WebAccessDto mapToWebAccessDto(WebAccess webAccess) {
        WebAccessDto dto = new WebAccessDto();
        dto.setId(webAccess.getId());
        dto.setUrl(webAccess.getUrl());
        dto.setServiceName(webAccess.getServiceName());
        dto.setAccessUsername(webAccess.getAccessUsername());
        dto.setAccessPassword(webAccess.getAccessPassword()); // Be cautious about sending passwords, even in DTOs
        if (webAccess.getAssignedEmployee() != null) {
            dto.setAssignedEmployeeId(webAccess.getAssignedEmployee().getId());
            dto.setAssignedEmployeeName(webAccess.getAssignedEmployee().getName());
        }
        return dto;
    }

    private WebAccess mapToWebAccessEntity(WebAccessDto dto) {
        WebAccess webAccess = new WebAccess();
        webAccess.setUrl(dto.getUrl());
        webAccess.setServiceName(dto.getServiceName());
        webAccess.setAccessUsername(dto.getAccessUsername());
        webAccess.setAccessPassword(dto.getAccessPassword()); // Consider encryption here if passwords are to be stored encrypted
        if (dto.getAssignedEmployeeId() != null) {
            Employee employee = employeeRepository.findById(dto.getAssignedEmployeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found for web access assignment: " + dto.getAssignedEmployeeId()));
            webAccess.setAssignedEmployee(employee);
        }
        return webAccess;
    }
}
