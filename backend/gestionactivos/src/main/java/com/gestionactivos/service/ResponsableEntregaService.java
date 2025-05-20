package com.gestionactivos.service;

import com.gestionactivos.dto.ResponsableEntregaDTO;

import java.util.List;

public interface ResponsableEntregaService {

    List<ResponsableEntregaDTO> findAll();

    ResponsableEntregaDTO findById(Long id);

    ResponsableEntregaDTO save(ResponsableEntregaDTO responsableEntregaDTO);

    ResponsableEntregaDTO update(ResponsableEntregaDTO responsableEntregaDTO);

    void deleteById(Long id);

    List<ResponsableEntregaDTO> search(String nombre, String cargo);
}