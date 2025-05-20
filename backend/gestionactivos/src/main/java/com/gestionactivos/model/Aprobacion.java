package com.gestionactivos.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "aprobaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aprobacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acta_id", nullable = false)
    private Acta acta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aprobador_id", nullable = false)
    private UsuarioSistema aprobador;

    @Column(name = "fecha_aprobacion", nullable = false)
    private LocalDateTime fechaAprobacion;

    @Column(nullable = false)
    private boolean aprobado;

    private String observaciones;

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