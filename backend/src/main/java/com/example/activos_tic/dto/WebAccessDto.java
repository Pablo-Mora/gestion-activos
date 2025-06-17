package com.example.activos_tic.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class WebAccessDto {
    private Long id;

    @NotBlank
    @Size(max = 255)
    private String url;

    @NotBlank
    @Size(max = 100)
    private String serviceName;

    @NotBlank
    @Size(max = 100)
    private String accessUsername;

    @NotBlank
    @Size(max = 255)
    private String accessPassword; // Consider if this should be returned in DTOs

    private Long assignedEmployeeId;
    private String assignedEmployeeName;
}
