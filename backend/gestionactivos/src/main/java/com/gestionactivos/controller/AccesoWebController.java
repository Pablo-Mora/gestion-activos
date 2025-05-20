package com.gestionactivos.controller;

import com.gestionactivos.dto.AccesoWebDTO;
import com.gestionactivos.service.AccesoWebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/accesos-web")
public class AccesoWebController {

    private final AccesoWebService accesoWebService;

    @Autowired
    public AccesoWebController(AccesoWebService accesoWebService) {
        this.accesoWebService = accesoWebService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<List<AccesoWebDTO>> getAllAccesosWeb() {
        List<AccesoWebDTO> accesosWeb = accesoWebService.findAll();
        return new ResponseEntity<>(accesosWeb, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<AccesoWebDTO> getAccesoWebById(@PathVariable Long id) {
        AccesoWebDTO accesoWeb = accesoWebService.findById(id);
        return new ResponseEntity<>(accesoWeb, HttpStatus.OK);
    }

    @GetMapping("/empleado/{empleadoId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<List<AccesoWebDTO>> getAccesosWebByEmpleadoId(@PathVariable Long empleadoId) {
        List<AccesoWebDTO> accesosWeb = accesoWebService.findByEmpleadoId(empleadoId);
        return new ResponseEntity<>(accesosWeb, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<AccesoWebDTO> createAccesoWeb(@Valid @RequestBody AccesoWebDTO accesoWebDTO) {
        AccesoWebDTO createdAccesoWeb = accesoWebService.save(accesoWebDTO);
        return new ResponseEntity<>(createdAccesoWeb, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<AccesoWebDTO> updateAccesoWeb(@PathVariable Long id, @Valid @RequestBody AccesoWebDTO accesoWebDTO) {
        accesoWebDTO.setId(id);
        AccesoWebDTO updatedAccesoWeb = accesoWebService.update(accesoWebDTO);
        return new ResponseEntity<>(updatedAccesoWeb, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAccesoWeb(@PathVariable Long id) {
        accesoWebService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<List<AccesoWebDTO>> searchAccesosWeb(
            @RequestParam(required = false) String sitioWeb,
            @RequestParam(required = false) String usuario) {
        List<AccesoWebDTO> accesosWeb = accesoWebService.search(sitioWeb, usuario);
        return new ResponseEntity<>(accesosWeb, HttpStatus.OK);
    }
}