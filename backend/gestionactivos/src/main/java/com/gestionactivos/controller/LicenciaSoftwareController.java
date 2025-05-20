package com.gestionactivos.controller;

import com.gestionactivos.dto.LicenciaSoftwareDTO;
import com.gestionactivos.model.enums.EstadoActivo;
import com.gestionactivos.service.LicenciaSoftwareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/licencias/software")
public class LicenciaSoftwareController {

    private final LicenciaSoftwareService licenciaSoftwareService;

    @Autowired
    public LicenciaSoftwareController(LicenciaSoftwareService licenciaSoftwareService) {
        this.licenciaSoftwareService = licenciaSoftwareService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<List<LicenciaSoftwareDTO>> getAllLicencias() {
        List<LicenciaSoftwareDTO> licencias = licenciaSoftwareService.findAll();
        return ResponseEntity.ok(licencias);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<LicenciaSoftwareDTO> getLicenciaById(@PathVariable Long id) {
        LicenciaSoftwareDTO licencia = licenciaSoftwareService.findById(id);
        return ResponseEntity.ok(licencia);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<LicenciaSoftwareDTO> createLicencia(@RequestBody LicenciaSoftwareDTO licenciaDTO) {
        LicenciaSoftwareDTO newLicencia = licenciaSoftwareService.save(licenciaDTO);
        return new ResponseEntity<>(newLicencia, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<LicenciaSoftwareDTO> updateLicencia(
            @PathVariable Long id,
            @RequestBody LicenciaSoftwareDTO licenciaDTO) {
        licenciaDTO.setId(id);
        LicenciaSoftwareDTO updatedLicencia = licenciaSoftwareService.update(licenciaDTO);
        return ResponseEntity.ok(updatedLicencia);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLicencia(@PathVariable Long id) {
        licenciaSoftwareService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<List<LicenciaSoftwareDTO>> getLicenciasByEstado(@PathVariable EstadoActivo estado) {
        List<LicenciaSoftwareDTO> licencias = licenciaSoftwareService.findByEstado(estado);
        return ResponseEntity.ok(licencias);
    }

    @GetMapping("/empleado/{empleadoId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<List<LicenciaSoftwareDTO>> getLicenciasByEmpleado(@PathVariable Long empleadoId) {
        List<LicenciaSoftwareDTO> licencias = licenciaSoftwareService.findByEmpleadoId(empleadoId);
        return ResponseEntity.ok(licencias);
    }

    @GetMapping("/disponibles")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<List<LicenciaSoftwareDTO>> getLicenciasDisponibles() {
        List<LicenciaSoftwareDTO> licencias = licenciaSoftwareService.findByEstado(EstadoActivo.DISPONIBLE);
        return ResponseEntity.ok(licencias);
    }

    @PutMapping("/{id}/asignar/{empleadoId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<LicenciaSoftwareDTO> asignarLicenciaToEmpleado(
            @PathVariable Long id,
            @PathVariable Long empleadoId) {
        LicenciaSoftwareDTO licenciaAsignada = licenciaSoftwareService.asignarAEmpleado(id, empleadoId);
        return ResponseEntity.ok(licenciaAsignada);
    }

    @PutMapping("/{id}/devolver")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<LicenciaSoftwareDTO> devolverLicencia(@PathVariable Long id) {
        LicenciaSoftwareDTO licenciaDevuelta = licenciaSoftwareService.marcarComoDisponible(id);
        return ResponseEntity.ok(licenciaDevuelta);
    }

    @GetMapping("/proximas-expiracion")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<List<LicenciaSoftwareDTO>> getLicenciasProximasExpiracion(@RequestParam(defaultValue = "30") int dias) {
        List<LicenciaSoftwareDTO> licencias = licenciaSoftwareService.findByProximasExpiracion(dias);
        return ResponseEntity.ok(licencias);
    }

    @GetMapping("/expiradas")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<List<LicenciaSoftwareDTO>> getLicenciasExpiradas() {
        List<LicenciaSoftwareDTO> licencias = licenciaSoftwareService.findByExpiradas();
        return ResponseEntity.ok(licencias);
    }

    @GetMapping("/buscar/{terminoBusqueda}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<List<LicenciaSoftwareDTO>> buscarLicencias(@PathVariable String terminoBusqueda) {
        List<LicenciaSoftwareDTO> licencias = licenciaSoftwareService.buscarPorTermino(terminoBusqueda);
        return ResponseEntity.ok(licencias);
    }
}