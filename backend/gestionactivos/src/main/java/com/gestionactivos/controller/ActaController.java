package com.gestionactivos.controller;

import com.gestionactivos.dto.ActaDTO;
import com.gestionactivos.service.ActaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/actas")
public class ActaController {

    private final ActaService actaService;

    @Autowired
    public ActaController(ActaService actaService) {
        this.actaService = actaService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<List<ActaDTO>> getAllActas() {
        List<ActaDTO> actas = actaService.findAll();
        return new ResponseEntity<>(actas, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<ActaDTO> getActaById(@PathVariable Long id) {
        ActaDTO acta = actaService.findById(id);
        return new ResponseEntity<>(acta, HttpStatus.OK);
    }

    @GetMapping("/numero/{numero}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<ActaDTO> getActaByNumero(@PathVariable String numero) {
        ActaDTO acta = actaService.findByNumero(numero);
        return new ResponseEntity<>(acta, HttpStatus.OK);
    }

    @GetMapping("/empleado/{empleadoId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<List<ActaDTO>> getActasByEmpleadoId(@PathVariable Long empleadoId) {
        List<ActaDTO> actas = actaService.findByEmpleadoId(empleadoId);
        return new ResponseEntity<>(actas, HttpStatus.OK);
    }

    @GetMapping("/responsable/{responsableId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<List<ActaDTO>> getActasByResponsableId(@PathVariable Long responsableId) {
        List<ActaDTO> actas = actaService.findByResponsableId(responsableId);
        return new ResponseEntity<>(actas, HttpStatus.OK);
    }

    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<List<ActaDTO>> getActasByEstado(@PathVariable String estado) {
        List<ActaDTO> actas = actaService.findByEstado(estado);
        return new ResponseEntity<>(actas, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<ActaDTO> createActa(@Valid @RequestBody ActaDTO actaDTO) {
        ActaDTO createdActa = actaService.save(actaDTO);
        return new ResponseEntity<>(createdActa, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<ActaDTO> updateActa(@PathVariable Long id, @Valid @RequestBody ActaDTO actaDTO) {
        actaDTO.setId(id);
        ActaDTO updatedActa = actaService.update(actaDTO);
        return new ResponseEntity<>(updatedActa, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteActa(@PathVariable Long id) {
        actaService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{id}/enviar-aprobacion")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<ActaDTO> enviarAprobacion(@PathVariable Long id, @RequestBody List<Long> aprobadoresIds) {
        ActaDTO actaDTO = actaService.enviarAprobacion(id, aprobadoresIds);
        return new ResponseEntity<>(actaDTO, HttpStatus.OK);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<List<ActaDTO>> searchActas(
            @RequestParam(required = false) String numero,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String estado) {
        List<ActaDTO> actas = actaService.search(numero, tipo, estado);
        return new ResponseEntity<>(actas, HttpStatus.OK);
    }

    @GetMapping("/generar-pdf/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<byte[]> generarPdf(@PathVariable Long id) {
        byte[] pdfBytes = actaService.generarPdf(id);
        return ResponseEntity
                .ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=acta-" + id + ".pdf")
                .body(pdfBytes);
    }
}