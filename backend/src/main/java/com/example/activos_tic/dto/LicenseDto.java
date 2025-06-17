package com.example.activos_tic.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Data
public class LicenseDto {
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String softwareName;

    @NotBlank
    @Size(max = 255)
    private String licenseKey;

    private LocalDate purchaseDate;
    private LocalDate expirationDate;
    private Long assignedEmployeeId;
    private String assignedEmployeeName;
}
