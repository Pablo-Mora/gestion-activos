package com.gestionactivos.service;

import com.gestionactivos.dto.LicenciaSoftwareDTO;

import java.util.List;

public interface LicenciaSoftwareService {

    LicenciaSoftwareDTO crearLicenciaSoftware(LicenciaSoftwareDTO licenciaSoftwareDTO);

    List<LicenciaSoftwareDTO> listarTodasLicenciasSoftware();

    LicenciaSoftwareDTO obtenerLicenciaSoftwarePorId(Long id);

    LicenciaSoftwareDTO actualizarLicenciaSoftware(Long id, LicenciaSoftwareDTO licenciaSoftwareDTO);

    void eliminarLicenciaSoftware(Long id);
}