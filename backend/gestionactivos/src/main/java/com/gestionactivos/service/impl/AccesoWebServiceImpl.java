package com.gestionactivos.service.impl;

import com.gestionactivos.dto.AccesoWebDTO;
import com.gestionactivos.exception.ResourceNotFoundException;
import com.gestionactivos.model.AccesoWeb;
import com.gestionactivos.repository.AccesoWebRepository;
import com.gestionactivos.service.AccesoWebService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccesoWebServiceImpl implements AccesoWebService {

    private final AccesoWebRepository accesoWebRepository;

    @Autowired
    public AccesoWebServiceImpl(AccesoWebRepository accesoWebRepository) {
        this.accesoWebRepository = accesoWebRepository;
    }

    @Override
    public AccesoWebDTO crearAccesoWeb(AccesoWebDTO accesoWebDTO) {
        AccesoWeb accesoWeb = new AccesoWeb();
        BeanUtils.copyProperties(accesoWebDTO, accesoWeb);
        AccesoWeb guardado = accesoWebRepository.save(accesoWeb);

        AccesoWebDTO resultado = new AccesoWebDTO();
        BeanUtils.copyProperties(guardado, resultado);
        return resultado;
    }

    @Override
    public List<AccesoWebDTO> listarTodosAccesosWeb() {
        List<AccesoWeb> accesos = accesoWebRepository.findAll();
        return accesos.stream()
                .map(acceso -> {
                    AccesoWebDTO dto = new AccesoWebDTO();
                    BeanUtils.copyProperties(acceso, dto);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public AccesoWebDTO obtenerAccesoWebPorId(Long id) {
        AccesoWeb accesoWeb = accesoWebRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AccesoWeb", "id", id));

        AccesoWebDTO dto = new AccesoWebDTO();
        BeanUtils.copyProperties(accesoWeb, dto);
        return dto;
    }

    @Override
    public AccesoWebDTO actualizarAccesoWeb(Long id, AccesoWebDTO accesoWebDTO) {
        AccesoWeb existente = accesoWebRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AccesoWeb", "id", id));

        BeanUtils.copyProperties(accesoWebDTO, existente);
        existente.setId(id); // Aseguramos que el ID no cambie

        AccesoWeb actualizado = accesoWebRepository.save(existente);

        AccesoWebDTO resultado = new AccesoWebDTO();
        BeanUtils.copyProperties(actualizado, resultado);
        return resultado;
    }

    @Override
    public void eliminarAccesoWeb(Long id) {
        AccesoWeb accesoWeb = accesoWebRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AccesoWeb", "id", id));

        accesoWebRepository.delete(accesoWeb);
    }
}