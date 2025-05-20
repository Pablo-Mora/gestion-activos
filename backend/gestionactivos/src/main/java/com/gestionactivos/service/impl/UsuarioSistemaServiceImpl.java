package com.gestionactivos.service.impl;

import com.gestionactivos.dto.UsuarioSistemaDTO;
import com.gestionactivos.exception.ResourceNotFoundException;
import com.gestionactivos.model.UsuarioSistema;
import com.gestionactivos.repository.UsuarioSistemaRepository;
import com.gestionactivos.service.UsuarioSistemaService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioSistemaServiceImpl implements UsuarioSistemaService {

    private final UsuarioSistemaRepository usuarioSistemaRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UsuarioSistemaServiceImpl(UsuarioSistemaRepository usuarioSistemaRepository, PasswordEncoder passwordEncoder) {
        this.usuarioSistemaRepository = usuarioSistemaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UsuarioSistemaDTO crearUsuarioSistema(UsuarioSistemaDTO usuarioSistemaDTO) {
        UsuarioSistema usuarioSistema = new UsuarioSistema();
        BeanUtils.copyProperties(usuarioSistemaDTO, usuarioSistema);

        // Encriptar la contraseña antes de guardar
        usuarioSistema.setPassword(passwordEncoder.encode(usuarioSistemaDTO.getPassword()));

        UsuarioSistema guardado = usuarioSistemaRepository.save(usuarioSistema);

        UsuarioSistemaDTO resultado = new UsuarioSistemaDTO();
        BeanUtils.copyProperties(guardado, resultado);
        // No devolver la contraseña en el DTO
        resultado.setPassword(null);
        return resultado;
    }

    @Override
    public List<UsuarioSistemaDTO> listarTodosUsuariosSistema() {
        List<UsuarioSistema> usuarios = usuarioSistemaRepository.findAll();
        return usuarios.stream()
                .map(usuario -> {
                    UsuarioSistemaDTO dto = new UsuarioSistemaDTO();
                    BeanUtils.copyProperties(usuario, dto);
                    // No incluir la contraseña en el DTO
                    dto.setPassword(null);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioSistemaDTO obtenerUsuarioSistemaPorId(Long id) {
        UsuarioSistema usuarioSistema = usuarioSistemaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UsuarioSistema", "id", id));

        UsuarioSistemaDTO dto = new UsuarioSistemaDTO();
        BeanUtils.copyProperties(usuarioSistema, dto);
        // No incluir la contraseña en el DTO
        dto.setPassword(null);
        return dto;
    }

    @Override
    public UsuarioSistemaDTO actualizarUsuarioSistema(Long id, UsuarioSistemaDTO usuarioSistemaDTO) {
        UsuarioSistema existente = usuarioSistemaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UsuarioSistema", "id", id));

        // Conservar la contraseña actual si no se proporciona una nueva
        String passwordActual = existente.getPassword();

        BeanUtils.copyProperties(usuarioSistemaDTO, existente);
        existente.setId(id); // Aseguramos que el ID no cambie

        // Si se proporciona una nueva contraseña, cifrarla
        if (usuarioSistemaDTO.getPassword() != null && !usuarioSistemaDTO.getPassword().isEmpty()) {
            existente.setPassword(passwordEncoder.encode(usuarioSistemaDTO.getPassword()));
        } else {
            existente.setPassword(passwordActual);
        }

        UsuarioSistema actualizado = usuarioSistemaRepository.save(existente);

        UsuarioSistemaDTO resultado = new UsuarioSistemaDTO();
        BeanUtils.copyProperties(actualizado, resultado);
        // No devolver la contraseña en el DTO
        resultado.setPassword(null);
        return resultado;
    }

    @Override
    public void eliminarUsuarioSistema(Long id) {
        UsuarioSistema usuarioSistema = usuarioSistemaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UsuarioSistema", "id", id));

        usuarioSistemaRepository.delete(usuarioSistema);
    }

    @Override
    public Optional<UsuarioSistema> buscarPorUsername(String username) {
        return usuarioSistemaRepository.findByUsername(username);
    }
}