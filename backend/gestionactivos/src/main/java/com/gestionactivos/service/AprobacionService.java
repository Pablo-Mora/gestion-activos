package com.gestionactivos.service;

import com.gestionactivos.dto.AprobacionDTO;

import java.util.List;

public interface AprobacionService {

    List<AprobacionDTO> findAll();

    AprobacionDTO findById(Long id);

    List<AprobacionDTO> findByActaId(Long actaId);

    List<AprobacionDTO> findByUsuarioId(Long usuarioId);

    AprobacionDTO save(AprobacionDTO aprobacionDTO);

    AprobacionDTO update(AprobacionDTO aprobacionDTO);

    void deleteById(Long id);

    AprobacionDTO aprobar(Long id, String comentario);

    AprobacionDTO rechazar(Long id, String motivoRechazo);
}