package com.gestionactivos.dto;

import java.time.LocalDate;

public class EmpleadoDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String departamento;
    private String cargo;
    private String telefono;
    private LocalDate fechaIngreso;

    // Constructores
    public EmpleadoDTO() {
    }

    public EmpleadoDTO(Long id, String nombre, String apellido, String email,
                       String departamento, String cargo, String telefono,
                       LocalDate fechaIngreso) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.departamento = departamento;
        this.cargo = cargo;
        this.telefono = telefono;
        this.fechaIngreso = fechaIngreso;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDate fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }
}