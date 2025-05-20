package com.gestionactivos.service;

import com.gestionactivos.dto.ActaDTO;
import java.util.List;

public interface ActaService {
    ActaDTO crearActa(ActaDTO actaDTO);
    ActaDTO actualizarActa(Long id, ActaDTO actaDTO);
    void eliminarActa(Long id);
    ActaDTO obtenerActaPorId(Long id);
    List<ActaDTO> listarActas();
    List<ActaDTO> buscarActasPorEmpleado(Long empleadoId);
    List<ActaDTO> buscarActasPorResponsable(Long responsableId);
    byte[] generarPDFActa(Long actaId);
}