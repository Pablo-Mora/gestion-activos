package com.gestionactivos.model;

import com.gestionactivos.model.enums.EstadoActivo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "accesos_web")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccesoWeb {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String url;

    @Column(name = "nombre_usuario", nullable = false)
    private String nombreUsuario;

    // No almacenamos contraseñas en texto plano, solo registramos que existe
    @Column(name = "tiene_credenciales")
    private boolean tieneCredenciales;

    @Column(name = "tipo_acceso", nullable = false)
    private String tipoAcceso;

    @Column(name = "fecha_expiracion")
    private LocalDateTime fechaExpiracion;

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