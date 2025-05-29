package com.gestionactivos.controller;

import com.gestionactivos.dto.AprobacionDTO;
import com.gestionactivos.service.AprobacionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.*;
import java.util.List;

@RestController
@RequestMapping("/api/aprobaciones")
public class AprobacionController {

    private final AprobacionService aprobacionService;

    @Autowired
    public AprobacionController(AprobacionService aprobacionService) {
        this.aprobacionService = aprobacionService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<List<AprobacionDTO>> getAllAprobaciones() {
        List<AprobacionDTO> aprobaciones = aprobacionService.findAll();
        return new ResponseEntity<>(aprobaciones, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<AprobacionDTO> getAprobacionById(@PathVariable Long id) {
        AprobacionDTO aprobacion = aprobacionService.findById(id);
        return new ResponseEntity<>(aprobacion, HttpStatus.OK);
    }

    @GetMapping("/acta/{actaId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<List<AprobacionDTO>> getAprobacionesByActaId(@PathVariable Long actaId) {
        List<AprobacionDTO> aprobaciones = aprobacionService.findByActaId(actaId);
        return new ResponseEntity<>(aprobaciones, HttpStatus.OK);
    }

    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<List<AprobacionDTO>> getAprobacionesByUsuarioId(@PathVariable Long usuarioId) {
        List<AprobacionDTO> aprobaciones = aprobacionService.findByUsuarioId(usuarioId);
        return new ResponseEntity<>(aprobaciones, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<AprobacionDTO> createAprobacion(@Valid @RequestBody AprobacionDTO aprobacionDTO) {
        AprobacionDTO createdAprobacion = aprobacionService.save(aprobacionDTO);
        return new ResponseEntity<>(createdAprobacion, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<AprobacionDTO> updateAprobacion(@PathVariable Long id, @Valid @RequestBody AprobacionDTO aprobacionDTO) {
        aprobacionDTO.setId(id);
        AprobacionDTO updatedAprobacion = aprobacionService.update(aprobacionDTO);
        return new ResponseEntity<>(updatedAprobacion, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAprobacion(@PathVariable Long id) {
        aprobacionService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/aprobar/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<AprobacionDTO> aprobar(@PathVariable Long id, @RequestBody(required = false) String comentario) {
        AprobacionDTO aprobacionDTO = aprobacionService.aprobar(id, comentario);
        return new ResponseEntity<>(aprobacionDTO, HttpStatus.OK);
    }

    @PostMapping("/rechazar/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<AprobacionDTO> rechazar(@PathVariable Long id, @RequestBody String motivoRechazo) {
        AprobacionDTO aprobacionDTO = aprobacionService.rechazar(id, motivoRechazo);
        return new ResponseEntity<>(aprobacionDTO, HttpStatus.OK);
    }
}