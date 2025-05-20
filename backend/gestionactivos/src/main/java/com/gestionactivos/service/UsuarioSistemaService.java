package com.gestionactivos.service;

import com.gestionactivos.dto.LoginRequestDTO;
import com.gestionactivos.dto.LoginResponseDTO;
import com.gestionactivos.dto.UsuarioSistemaDTO;
import java.util.List;

public interface UsuarioSistemaService {
    UsuarioSistemaDTO crearUsuario(UsuarioSistemaDTO usuarioDTO);
    UsuarioSistemaDTO actualizarUsuario(Long id, UsuarioSistemaDTO usuarioDTO);
    void eliminarUsuario(Long id);
    UsuarioSistemaDTO obtenerUsuarioPorId(Long id);
    UsuarioSistemaDTO obtenerUsuarioPorUsername(String username);
    List<UsuarioSistemaDTO> listarUsuarios();
    LoginResponseDTO autenticarUsuario(LoginRequestDTO loginRequest);
    boolean cambiarPassword(Long usuarioId, String oldPassword, String newPassword);
}