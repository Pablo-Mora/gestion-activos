package com.gestionactivos.dto;

import java.time.LocalDate;

public class LicenciaSoftwareDTO {
    private Long id;
    private String nombreSoftware;
    private String version;
    private String licencia;
    private LocalDate fechaAdquisicion;
    private LocalDate fechaExpiracion;
    private String tipo; // Perpetua, Suscripción, etc.
    private Integer cantidadLicencias;
    private Integer licenciasDisponibles;
    private Double costo;
    private String proveedor;
    private Long empleadoId;
    private String empleadoNombre;
    private Long activoHardwareId;
    private String activoHardwareNombre;

    // Constructores
    public LicenciaSoftwareDTO() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreSoftware() {
        return nombreSoftware;
    }

    public void setNombreSoftware(String nombreSoftware) {
        this.nombreSoftware = nombreSoftware;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getLicencia() {
        return licencia;
    }

    public void setLicencia(String licencia) {
        this.licencia = licencia;
    }

    public LocalDate getFechaAdquisicion() {
        return fechaAdquisicion;
    }

    public void setFechaAdquisicion(LocalDate fechaAdquisicion) {
        this.fechaAdquisicion = fechaAdquisicion;
    }

    public LocalDate getFechaExpiracion() {
        return fechaExpiracion;
    }

    public void setFechaExpiracion(LocalDate fechaExpiracion) {
        this.fechaExpiracion = fechaExpiracion;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Integer getCantidadLicencias() {
        return cantidadLicencias;
    }

    public void setCantidadLicencias(Integer cantidadLicencias) {
        this.cantidadLicencias = cantidadLicencias;
    }

    public Integer getLicenciasDisponibles() {
        return licenciasDisponibles;
    }

    public void setLicenciasDisponibles(Integer licenciasDisponibles) {
        this.licenciasDisponibles = licenciasDisponibles;
    }

    public Double getCosto() {
        return costo;
    }

    public void setCosto(Double costo) {
        this.costo = costo;
    }

    public String getProveedor() {
        return proveedor;
    }

    public void setProveedor(String proveedor) {
        this.proveedor = proveedor;
    }

    public Long getEmpleadoId() {
        return empleadoId;
    }

    public void setEmpleadoId(Long empleadoId) {
        this.empleadoId = empleadoId;
    }

    public String getEmpleadoNombre() {
        return empleadoNombre;
    }

    public void setEmpleadoNombre(String empleadoNombre) {
        this.empleadoNombre = empleadoNombre;
    }

    public Long getActivoHardwareId() {
        return activoHardwareId;
    }

    public void setActivoHardwareId(Long activoHardwareId) {
        this.activoHardwareId = activoHardwareId;
    }

    public String getActivoHardwareNombre() {
        return activoHardwareNombre;
    }

    public void setActivoHardwareNombre(String activoHardwareNombre) {
        this.activoHardwareNombre = activoHardwareNombre;
    }
}