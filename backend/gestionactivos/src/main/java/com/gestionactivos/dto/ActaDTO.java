package com.gestionactivos.dto;

import java.time.LocalDate;
import java.util.List;

public class ActaDTO {
    private Long id;
    private String numeroActa;
    private LocalDate fechaCreacion;
    private String tipoActa; // Entrega, Devolución, etc.
    private String observaciones;
    private Long empleadoId;
    private String empleadoNombre;
    private Long responsableEntregaId;
    private String responsableEntregaNombre;
    private List<Long> activosHardwareIds;
    private List<String> activosHardwareNombres;
    private List<Long> licenciasSoftwareIds;
    private List<String> licenciasSoftwareNombres;
    private List<Long> accesosWebIds;
    private List<String> accesosWebNombres;

    // Constructores
    public ActaDTO() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroActa() {
        return numeroActa;
    }

    public void setNumeroActa(String numeroActa) {
        this.numeroActa = numeroActa;
    }

    public LocalDate getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDate fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getTipoActa() {
        return tipoActa;
    }

    public void setTipoActa(String tipoActa) {
        this.tipoActa = tipoActa;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
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

    public Long getResponsableEntregaId() {
        return responsableEntregaId;
    }

    public void setResponsableEntregaId(Long responsableEntregaId) {
        this.responsableEntregaId = responsableEntregaId;
    }

    public String getResponsableEntregaNombre() {
        return responsableEntregaNombre;
    }

    public void setResponsableEntregaNombre(String responsableEntregaNombre) {
        this.responsableEntregaNombre = responsableEntregaNombre;
    }

    public List<Long> getActivosHardwareIds() {
        return activosHardwareIds;
    }

    public void setActivosHardwareIds(List<Long> activosHardwareIds) {
        this.activosHardwareIds = activosHardwareIds;
    }

    public List<String> getActivosHardwareNombres() {
        return activosHardwareNombres;
    }

    public void setActivosHardwareNombres(List<String> activosHardwareNombres) {
        this.activosHardwareNombres = activosHardwareNombres;
    }

    public List<Long> getLicenciasSoftwareIds() {
        return licenciasSoftwareIds;
    }

    public void setLicenciasSoftwareIds(List<Long> licenciasSoftwareIds) {
        this.licenciasSoftwareIds = licenciasSoftwareIds;
    }

    public List<String> getLicenciasSoftwareNombres() {
        return licenciasSoftwareNombres;
    }

    public void setLicenciasSoftwareNombres(List<String> licenciasSoftwareNombres) {
        this.licenciasSoftwareNombres = licenciasSoftwareNombres;
    }

    public List<Long> getAccesosWebIds() {
        return accesosWebIds;
    }

    public void setAccesosWebIds(List<Long> accesosWebIds) {
        this.accesosWebIds = accesosWebIds;
    }

    public List<String> getAccesosWebNombres() {
        return accesosWebNombres;
    }

    public void setAccesosWebNombres(List<String> accesosWebNombres) {
        this.accesosWebNombres = accesosWebNombres;
    }
}