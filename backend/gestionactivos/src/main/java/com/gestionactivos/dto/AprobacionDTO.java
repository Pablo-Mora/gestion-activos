package com.gestionactivos.dto;

import java.time.LocalDate;

public class AprobacionDTO {
    private Long id;
    private String tipoAprobacion;
    private String estado; // Pendiente, Aprobado, Rechazado
    private LocalDate fechaSolicitud;
    private LocalDate fechaAprobacion;
    private String comentarios;
    private Long aprobadorId;
    private String aprobadorNombre;
    private Long solicitanteId;
    private String solicitanteNombre;

    // Constructores
    public AprobacionDTO() {
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipoAprobacion() {
        return tipoAprobacion;
    }

    public void setTipoAprobacion(String tipoAprobacion) {
        this.tipoAprobacion = tipoAprobacion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDate getFechaSolicitud() {
        return fechaSolicitud;
    }

    public void setFechaSolicitud(LocalDate fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }

    public LocalDate getFechaAprobacion() {
        return fechaAprobacion;
    }

    public void setFechaAprobacion(LocalDate fechaAprobacion) {
        this.fechaAprobacion = fechaAprobacion;
    }

    public String getComentarios() {
        return comentarios;
    }

    public void setComentarios(String comentarios) {
        this.comentarios = comentarios;
    }

    public Long getAprobadorId() {
        return aprobadorId;
    }

    public void setAprobadorId(Long aprobadorId) {
        this.aprobadorId = aprobadorId;
    }

    public String getAprobadorNombre() {
        return aprobadorNombre;
    }

    public void setAprobadorNombre(String aprobadorNombre) {
        this.aprobadorNombre = aprobadorNombre;
    }

    public Long getSolicitanteId() {
        return solicitanteId;
    }

    public void setSolicitanteId(Long solicitanteId) {
        this.solicitanteId = solicitanteId;
    }

    public String getSolicitanteNombre() {
        return solicitanteNombre;
    }

    public void setSolicitanteNombre(String solicitanteNombre) {
        this.solicitanteNombre = solicitanteNombre;
    }
}