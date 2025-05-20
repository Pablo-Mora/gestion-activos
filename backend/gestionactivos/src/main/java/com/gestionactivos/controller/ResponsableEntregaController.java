package com.gestionactivos.controller;

import com.gestionactivos.dto.ResponsableEntregaDTO;
import com.gestionactivos.service.ResponsableEntregaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/responsables-entrega")
public class ResponsableEntregaController {

    private final ResponsableEntregaService responsableEntregaService;

    @Autowired
    public ResponsableEntregaController(ResponsableEntregaService responsableEntregaService) {
        this.responsableEntregaService = responsableEntregaService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<List<ResponsableEntregaDTO>> getAllResponsablesEntrega() {
        List<ResponsableEntregaDTO> responsablesEntrega = responsableEntregaService.findAll();
        return new ResponseEntity<>(responsablesEntrega, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<ResponsableEntregaDTO> getResponsableEntregaById(@PathVariable Long id) {
        ResponsableEntregaDTO responsableEntrega = responsableEntregaService.findById(id);
        return new ResponseEntity<>(responsableEntrega, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponsableEntregaDTO> createResponsableEntrega(@Valid @RequestBody ResponsableEntregaDTO responsableEntregaDTO) {
        ResponsableEntregaDTO createdResponsableEntrega = responsableEntregaService.save(responsableEntregaDTO);
        return new ResponseEntity<>(createdResponsableEntrega, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResponsableEntregaDTO> updateResponsableEntrega(@PathVariable Long id, @Valid @RequestBody ResponsableEntregaDTO responsableEntregaDTO) {
        responsableEntregaDTO.setId(id);
        ResponsableEntregaDTO updatedResponsableEntrega = responsableEntregaService.update(responsableEntregaDTO);
        return new ResponseEntity<>(updatedResponsableEntrega, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResponsableEntrega(@PathVariable Long id) {
        responsableEntregaService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<List<ResponsableEntregaDTO>> searchResponsablesEntrega(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String cargo) {
        List<ResponsableEntregaDTO> responsablesEntrega = responsableEntregaService.search(nombre, cargo);
        return new ResponseEntity<>(responsablesEntrega, HttpStatus.OK);
    }
}