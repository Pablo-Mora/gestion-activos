package com.gestionactivos.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "actas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Acta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_acta", nullable = false, unique = true)
    private String numeroActa;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsable_id", nullable = false)
    private ResponsableEntrega responsableEntrega;

    @Column(name = "tipo_acta", nullable = false)
    private String tipoActa; // ENTREGA, DEVOLUCION

    private String observaciones;

    @OneToMany(mappedBy = "acta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ActivoHardware> activosHardware = new ArrayList<>();

    @OneToMany(mappedBy = "acta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LicenciaSoftware> licenciasSoftware = new ArrayList<>();

    @OneToMany(mappedBy = "acta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AccesoWeb> accesosWeb = new ArrayList<>();

    @OneToOne(mappedBy = "acta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Aprobacion aprobacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}