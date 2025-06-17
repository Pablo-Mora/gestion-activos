package com.example.activos_tic.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class HardwareDto {
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String type;

    @Size(max = 100)
    private String brand;

    @NotBlank
    @Size(max = 100)
    private String serialNumber;

    @Size(max = 255)
    private String location;

    private Long assignedEmployeeId; // To link to an employee
    private String assignedEmployeeName; // For display purposes
}
