package com.gestionactivos.service;

import com.gestionactivos.dto.AccesoWebDTO;

import java.util.List;

public interface AccesoWebService {

    AccesoWebDTO crearAccesoWeb(AccesoWebDTO accesoWebDTO);

    List<AccesoWebDTO> listarTodosAccesosWeb();

    AccesoWebDTO obtenerAccesoWebPorId(Long id);

    AccesoWebDTO actualizarAccesoWeb(Long id, AccesoWebDTO accesoWebDTO);

    void eliminarAccesoWeb(Long id);
}