package com.gestionactivos.dto;

import com.gestionactivos.model.enums.RolUsuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioSistemaDTO {
    private Long id;
    private String username;
    private String nombre;
    private String apellido;
    private String email;
    private RolUsuario rol;
    private boolean activo;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}