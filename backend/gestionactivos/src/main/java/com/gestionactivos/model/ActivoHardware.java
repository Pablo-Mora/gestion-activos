package com.gestionactivos.model;

import com.gestionactivos.model.enums.EstadoActivo;
import com.gestionactivos.model.enums.TipoActivo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "activos_hardware")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivoHardware {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(name = "numero_serie", nullable = false, unique = true)
    private String numeroSerie;

    @Column(name = "codigo_inventario", unique = true)
    private String codigoInventario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoActivo tipo;

    @Column(nullable = false)
    private String marca;

    @Column(nullable = false)
    private String modelo;

    @Column(name = "fecha_adquisicion")
    private LocalDateTime fechaAdquisicion;

    @Column(name = "fecha_vencimiento_garantia")
    private LocalDateTime fechaVencimientoGarantia;

    private String procesador;

    private String ram;

    private String almacenamiento;

    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoActivo estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    @Column(name = "fecha_asignacion")
    private LocalDateTime fechaAsignacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acta_id")
    private Acta acta;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

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