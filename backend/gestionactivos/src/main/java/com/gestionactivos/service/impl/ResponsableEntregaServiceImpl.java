package com.gestionactivos.service.impl;

import com.gestionactivos.dto.ResponsableEntregaDTO;
import com.gestionactivos.exception.ResourceNotFoundException;
import com.gestionactivos.model.ResponsableEntrega;
import com.gestionactivos.repository.ResponsableEntregaRepository;
import com.gestionactivos.service.ResponsableEntregaService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResponsableEntregaServiceImpl implements ResponsableEntregaService {

    private final ResponsableEntregaRepository responsableEntregaRepository;

    @Autowired
    public ResponsableEntregaServiceImpl(ResponsableEntregaRepository responsableEntregaRepository) {
        this.responsableEntregaRepository = responsableEntregaRepository;
    }

    @Override
    public ResponsableEntregaDTO crearResponsableEntrega(ResponsableEntregaDTO responsableEntregaDTO) {
        ResponsableEntrega responsableEntrega = new ResponsableEntrega();
        BeanUtils.copyProperties(responsableEntregaDTO, responsableEntrega);
        ResponsableEntrega guardado = responsableEntregaRepository.save(responsableEntrega);

        ResponsableEntregaDTO resultado = new ResponsableEntregaDTO();
        BeanUtils.copyProperties(guardado, resultado);
        return resultado;
    }

    @Override
    public List<ResponsableEntregaDTO> listarTodosResponsablesEntrega() {
        List<ResponsableEntrega> responsables = responsableEntregaRepository.findAll();
        return responsables.stream()
                .map(responsable -> {
                    ResponsableEntregaDTO dto = new ResponsableEntregaDTO();
                    BeanUtils.copyProperties(responsable, dto);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public ResponsableEntregaDTO obtenerResponsableEntregaPorId(Long id) {
        ResponsableEntrega responsableEntrega = responsableEntregaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ResponsableEntrega", "id", id));

        ResponsableEntregaDTO dto = new ResponsableEntregaDTO();
        BeanUtils.copyProperties(responsableEntrega, dto);
        return dto;
    }

    @Override
    public ResponsableEntregaDTO actualizarResponsableEntrega(Long id, ResponsableEntregaDTO responsableEntregaDTO) {
        ResponsableEntrega existente = responsableEntregaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ResponsableEntrega", "id", id));

        BeanUtils.copyProperties(responsableEntregaDTO, existente);
        existente.setId(id); // Aseguramos que el ID no cambie

        ResponsableEntrega actualizado = responsableEntregaRepository.save(existente);

        ResponsableEntregaDTO resultado = new ResponsableEntregaDTO();
        BeanUtils.copyProperties(actualizado, resultado);
        return resultado;
    }

    @Override
    public void eliminarResponsableEntrega(Long id) {
        ResponsableEntrega responsableEntrega = responsableEntregaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ResponsableEntrega", "id", id));

        responsableEntregaRepository.delete(responsableEntrega);
    }
}