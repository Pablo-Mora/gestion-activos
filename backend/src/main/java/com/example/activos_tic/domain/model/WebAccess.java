package com.example.activos_tic.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "web_accesses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WebAccess {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false)
    private String url;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String serviceName; // e.g., "Company VPN", "Cloud Storage"

    @NotBlank
    @Size(max = 100)
    private String accessUsername; // Renamed from username to avoid confusion with User.username

    @NotBlank
    @Size(max = 255)
    private String accessPassword; // Consider encryption at application level if very sensitive

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee assignedEmployee;
}
