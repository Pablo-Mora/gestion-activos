package com.gestionactivos.controller;

import com.gestionactivos.dto.ApiResponseDTO;
import com.gestionactivos.dto.LoginRequestDTO;
import com.gestionactivos.dto.LoginResponseDTO;
import com.gestionactivos.dto.UsuarioSistemaDTO;
import com.gestionactivos.service.UsuarioSistemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioSistemaController {

    private final UsuarioSistemaService usuarioService;

    @Autowired
    public UsuarioSistemaController(UsuarioSistemaService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO<LoginResponseDTO>> login(@RequestBody LoginRequestDTO loginRequest) {
        LoginResponseDTO loginResponse = usuarioService.autenticarUsuario(loginRequest);
        ApiResponseDTO<LoginResponseDTO> response = new ApiResponseDTO<>(
                true,
                "Inicio de sesión exitoso",
                loginResponse
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<UsuarioSistemaDTO>> crearUsuario(@RequestBody UsuarioSistemaDTO usuarioDTO) {
        UsuarioSistemaDTO nuevoUsuario = usuarioService.crearUsuario(usuarioDTO);
        ApiResponseDTO<UsuarioSistemaDTO> response = new ApiResponseDTO<>(
                true,
                "Usuario creado exitosamente",
                nuevoUsuario
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<UsuarioSistemaDTO>> actualizarUsuario(
            @PathVariable Long id,
            @RequestBody UsuarioSistemaDTO usuarioDTO) {
        UsuarioSistemaDTO usuarioActualizado = usuarioService.actualizarUsuario(id, usuarioDTO);
        ApiResponseDTO<UsuarioSistemaDTO> response = new ApiResponseDTO<>(
                true,
                "Usuario actualizado exitosamente",
                usuarioActualizado
        );
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<Void>> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        ApiResponseDTO<Void> response = new ApiResponseDTO<>(
                true,
                "Usuario eliminado exitosamente",
                null
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<UsuarioSistemaDTO>> obtenerUsuarioPorId(@PathVariable Long id) {
        UsuarioSistemaDTO usuario = usuarioService.obtenerUsuarioPorId(id);
        ApiResponseDTO<UsuarioSistemaDTO> response = new ApiResponseDTO<>(
                true,
                "Usuario obtenido exitosamente",
                usuario
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<List<UsuarioSistemaDTO>>> listarUsuarios() {
        List<UsuarioSistemaDTO> usuarios = usuarioService.listarUsuarios();
        ApiResponseDTO<List<UsuarioSistemaDTO>> response = new ApiResponseDTO<>(
                true,
                "Lista de usuarios obtenida exitosamente",
                usuarios
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/cambiar-password")
    @PreAuthorize("hasAnyRole('ADMIN', 'USUARIO')")
    public ResponseEntity<ApiResponseDTO<Boolean>> cambiarPassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> passwordData) {

        String oldPassword = passwordData.get("oldPassword");
        String newPassword = passwordData.get("newPassword");

        boolean resultado = usuarioService.cambiarPassword(id, oldPassword, newPassword);

        ApiResponseDTO<Boolean> response = new ApiResponseDTO<>(
                resultado,
                resultado ? "Contraseña cambiada exitosamente" : "No se pudo cambiar la contraseña",
                resultado
        );

        return ResponseEntity.ok(response);
    }
}