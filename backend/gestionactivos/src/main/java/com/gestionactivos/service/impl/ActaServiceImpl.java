package com.gestionactivos.service.impl;

import com.gestionactivos.dto.ActaDTO;
import com.gestionactivos.exception.ResourceNotFoundException;
import com.gestionactivos.model.Acta;
import com.gestionactivos.repository.ActaRepository;
import com.gestionactivos.service.ActaService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActaServiceImpl implements ActaService {

    private final ActaRepository actaRepository;

    @Autowired
    public ActaServiceImpl(ActaRepository actaRepository) {
        this.actaRepository = actaRepository;
    }

    @Override
    public ActaDTO crearActa(ActaDTO actaDTO) {
        Acta acta = new Acta();
        BeanUtils.copyProperties(actaDTO, acta);
        Acta guardada = actaRepository.save(acta);

        ActaDTO resultado = new ActaDTO();
        BeanUtils.copyProperties(guardada, resultado);
        return resultado;
    }

    @Override
    public List<ActaDTO> listarTodasActas() {
        List<Acta> actas = actaRepository.findAll();
        return actas.stream()
                .map(acta -> {
                    ActaDTO dto = new ActaDTO();
                    BeanUtils.copyProperties(acta, dto);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public ActaDTO obtenerActaPorId(Long id) {
        Acta acta = actaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Acta", "id", id));

        ActaDTO dto = new ActaDTO();
        BeanUtils.copyProperties(acta, dto);
        return dto;
    }

    @Override
    public ActaDTO actualizarActa(Long id, ActaDTO actaDTO) {
        Acta existente = actaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Acta", "id", id));

        BeanUtils.copyProperties(actaDTO, existente);
        existente.setId(id); // Aseguramos que el ID no cambie

        Acta actualizada = actaRepository.save(existente);

        ActaDTO resultado = new ActaDTO();
        BeanUtils.copyProperties(actualizada, resultado);
        return resultado;
    }

    @Override
    public void eliminarActa(Long id) {
        Acta acta = actaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Acta", "id", id));

        actaRepository.delete(acta);
    }
}