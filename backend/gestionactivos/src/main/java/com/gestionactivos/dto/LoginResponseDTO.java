package com.gestionactivos.dto;

public class LoginResponseDTO {
    private String token;
    private UsuarioSistemaDTO usuario;

    // Constructores
    public LoginResponseDTO() {
    }

    public LoginResponseDTO(String token, UsuarioSistemaDTO usuario) {
        this.token = token;
        this.usuario = usuario;
    }

    // Getters y Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UsuarioSistemaDTO getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioSistemaDTO usuario) {
        this.usuario = usuario;
    }
}