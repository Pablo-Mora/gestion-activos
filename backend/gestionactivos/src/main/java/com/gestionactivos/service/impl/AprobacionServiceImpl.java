package com.gestionactivos.service.impl;

import com.gestionactivos.dto.AprobacionDTO;
import com.gestionactivos.exception.ResourceNotFoundException;
import com.gestionactivos.model.Aprobacion;
import com.gestionactivos.repository.AprobacionRepository;
import com.gestionactivos.service.AprobacionService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AprobacionServiceImpl implements AprobacionService {

    private final AprobacionRepository aprobacionRepository;

    @Autowired
    public AprobacionServiceImpl(AprobacionRepository aprobacionRepository) {
        this.aprobacionRepository = aprobacionRepository;
    }

    @Override
    public AprobacionDTO crearAprobacion(AprobacionDTO aprobacionDTO) {
        Aprobacion aprobacion = new Aprobacion();
        BeanUtils.copyProperties(aprobacionDTO, aprobacion);
        Aprobacion guardada = aprobacionRepository.save(aprobacion);

        AprobacionDTO resultado = new AprobacionDTO();
        BeanUtils.copyProperties(guardada, resultado);
        return resultado;
    }

    @Override
    public List<AprobacionDTO> listarTodasAprobaciones() {
        List<Aprobacion> aprobaciones = aprobacionRepository.findAll();
        return aprobaciones.stream()
                .map(aprobacion -> {
                    AprobacionDTO dto = new AprobacionDTO();
                    BeanUtils.copyProperties(aprobacion, dto);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public AprobacionDTO obtenerAprobacionPorId(Long id) {
        Aprobacion aprobacion = aprobacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aprobacion", "id", id));

        AprobacionDTO dto = new AprobacionDTO();
        BeanUtils.copyProperties(aprobacion, dto);
        return dto;
    }

    @Override
    public AprobacionDTO actualizarAprobacion(Long id, AprobacionDTO aprobacionDTO) {
        Aprobacion existente = aprobacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aprobacion", "id", id));

        BeanUtils.copyProperties(aprobacionDTO, existente);
        existente.setId(id); // Aseguramos que el ID no cambie

        Aprobacion actualizada = aprobacionRepository.save(existente);

        AprobacionDTO resultado = new AprobacionDTO();
        BeanUtils.copyProperties(actualizada, resultado);
        return resultado;
    }

    @Override
    public void eliminarAprobacion(Long id) {
        Aprobacion aprobacion = aprobacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aprobacion", "id", id));

        aprobacionRepository.delete(aprobacion);
    }
}