package com.gestionactivos.service.impl;

import com.gestionactivos.dto.ActivoHardwareDTO;
import com.gestionactivos.exception.ResourceNotFoundException;
import com.gestionactivos.model.ActivoHardware;
import com.gestionactivos.repository.ActivoHardwareRepository;
import com.gestionactivos.service.ActivoHardwareService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivoHardwareServiceImpl implements ActivoHardwareService {

    private final ActivoHardwareRepository activoHardwareRepository;

    @Autowired
    public ActivoHardwareServiceImpl(ActivoHardwareRepository activoHardwareRepository) {
        this.activoHardwareRepository = activoHardwareRepository;
    }

    @Override
    public ActivoHardwareDTO crearActivoHardware(ActivoHardwareDTO activoHardwareDTO) {
        ActivoHardware activoHardware = new ActivoHardware();
        BeanUtils.copyProperties(activoHardwareDTO, activoHardware);
        ActivoHardware guardado = activoHardwareRepository.save(activoHardware);

        ActivoHardwareDTO resultado = new ActivoHardwareDTO();
        BeanUtils.copyProperties(guardado, resultado);
        return resultado;
    }

    @Override
    public List<ActivoHardwareDTO> listarTodosActivosHardware() {
        List<ActivoHardware> activos = activoHardwareRepository.findAll();
        return activos.stream()
                .map(activo -> {
                    ActivoHardwareDTO dto = new ActivoHardwareDTO();
                    BeanUtils.copyProperties(activo, dto);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public ActivoHardwareDTO obtenerActivoHardwarePorId(Long id) {
        ActivoHardware activoHardware = activoHardwareRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ActivoHardware", "id", id));

        ActivoHardwareDTO dto = new ActivoHardwareDTO();
        BeanUtils.copyProperties(activoHardware, dto);
        return dto;
    }

    @Override
    public ActivoHardwareDTO actualizarActivoHardware(Long id, ActivoHardwareDTO activoHardwareDTO) {
        ActivoHardware existente = activoHardwareRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ActivoHardware", "id", id));

        BeanUtils.copyProperties(activoHardwareDTO, existente);
        existente.setId(id); // Aseguramos que el ID no cambie

        ActivoHardware actualizado = activoHardwareRepository.save(existente);

        ActivoHardwareDTO resultado = new ActivoHardwareDTO();
        BeanUtils.copyProperties(actualizado, resultado);
        return resultado;
    }

    @Override
    public void eliminarActivoHardware(Long id) {
        ActivoHardware activoHardware = activoHardwareRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ActivoHardware", "id", id));

        activoHardwareRepository.delete(activoHardware);
    }
}