package com.gestionactivos.service.impl;

import com.gestionactivos.dto.LicenciaSoftwareDTO;
import com.gestionactivos.exception.ResourceNotFoundException;
import com.gestionactivos.model.LicenciaSoftware;
import com.gestionactivos.repository.LicenciaSoftwareRepository;
import com.gestionactivos.service.LicenciaSoftwareService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LicenciaSoftwareServiceImpl implements LicenciaSoftwareService {

    private final LicenciaSoftwareRepository licenciaSoftwareRepository;

    @Autowired
    public LicenciaSoftwareServiceImpl(LicenciaSoftwareRepository licenciaSoftwareRepository) {
        this.licenciaSoftwareRepository = licenciaSoftwareRepository;
    }

    @Override
    public LicenciaSoftwareDTO crearLicenciaSoftware(LicenciaSoftwareDTO licenciaSoftwareDTO) {
        LicenciaSoftware licenciaSoftware = new LicenciaSoftware();
        BeanUtils.copyProperties(licenciaSoftwareDTO, licenciaSoftware);
        LicenciaSoftware guardada = licenciaSoftwareRepository.save(licenciaSoftware);

        LicenciaSoftwareDTO resultado = new LicenciaSoftwareDTO();
        BeanUtils.copyProperties(guardada, resultado);
        return resultado;
    }

    @Override
    public List<LicenciaSoftwareDTO> listarTodasLicenciasSoftware() {
        List<LicenciaSoftware> licencias = licenciaSoftwareRepository.findAll();
        return licencias.stream()
                .map(licencia -> {
                    LicenciaSoftwareDTO dto = new LicenciaSoftwareDTO();
                    BeanUtils.copyProperties(licencia, dto);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public LicenciaSoftwareDTO obtenerLicenciaSoftwarePorId(Long id) {
        LicenciaSoftware licenciaSoftware = licenciaSoftwareRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LicenciaSoftware", "id", id));

        LicenciaSoftwareDTO dto = new LicenciaSoftwareDTO();
        BeanUtils.copyProperties(licenciaSoftware, dto);
        return dto;
    }

    @Override
    public LicenciaSoftwareDTO actualizarLicenciaSoftware(Long id, LicenciaSoftwareDTO licenciaSoftwareDTO) {
        LicenciaSoftware existente = licenciaSoftwareRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LicenciaSoftware", "id", id));

        BeanUtils.copyProperties(licenciaSoftwareDTO, existente);
        existente.setId(id); // Aseguramos que el ID no cambie

        LicenciaSoftware actualizada = licenciaSoftwareRepository.save(existente);

        LicenciaSoftwareDTO resultado = new LicenciaSoftwareDTO();
        BeanUtils.copyProperties(actualizada, resultado);
        return resultado;
    }

    @Override
    public void eliminarLicenciaSoftware(Long id) {
        LicenciaSoftware licenciaSoftware = licenciaSoftwareRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LicenciaSoftware", "id", id));

        licenciaSoftwareRepository.delete(licenciaSoftware);
    }
}