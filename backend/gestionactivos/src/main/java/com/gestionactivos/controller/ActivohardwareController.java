package com.gestionactivos.controller;

import com.gestionactivos.dto.ActivoHardwareDTO;
import com.gestionactivos.model.enums.EstadoActivo;
import com.gestionactivos.service.ActivoHardwareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activos/hardware")
public class ActivoHardwareController {

    private final ActivoHardwareService activoHardwareService;

    @Autowired
    public ActivoHardwareController(ActivoHardwareService activoHardwareService) {
        this.activoHardwareService = activoHardwareService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<List<ActivoHardwareDTO>> getAllActivosHardware() {
        List<ActivoHardwareDTO> activos = activoHardwareService.findAll();
        return ResponseEntity.ok(activos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<ActivoHardwareDTO> getActivoHardwareById(@PathVariable Long id) {
        ActivoHardwareDTO activo = activoHardwareService.findById(id);
        return ResponseEntity.ok(activo);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<ActivoHardwareDTO> createActivoHardware(@RequestBody ActivoHardwareDTO activoHardwareDTO) {
        ActivoHardwareDTO newActivo = activoHardwareService.save(activoHardwareDTO);
        return new ResponseEntity<>(newActivo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<ActivoHardwareDTO> updateActivoHardware(
            @PathVariable Long id,
            @RequestBody ActivoHardwareDTO activoHardwareDTO) {
        activoHardwareDTO.setId(id);
        ActivoHardwareDTO updatedActivo = activoHardwareService.update(activoHardwareDTO);
        return ResponseEntity.ok(updatedActivo);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteActivoHardware(@PathVariable Long id) {
        activoHardwareService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<List<ActivoHardwareDTO>> getActivosByEstado(@PathVariable EstadoActivo estado) {
        List<ActivoHardwareDTO> activos = activoHardwareService.findByEstado(estado);
        return ResponseEntity.ok(activos);
    }

    @GetMapping("/empleado/{empleadoId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<List<ActivoHardwareDTO>> getActivosByEmpleado(@PathVariable Long empleadoId) {
        List<ActivoHardwareDTO> activos = activoHardwareService.findByEmpleadoId(empleadoId);
        return ResponseEntity.ok(activos);
    }

    @GetMapping("/disponibles")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<List<ActivoHardwareDTO>> getActivosDisponibles() {
        List<ActivoHardwareDTO> activos = activoHardwareService.findByEstado(EstadoActivo.DISPONIBLE);
        return ResponseEntity.ok(activos);
    }

    @PutMapping("/{id}/asignar/{empleadoId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<ActivoHardwareDTO> asignarActivoToEmpleado(
            @PathVariable Long id,
            @PathVariable Long empleadoId) {
        ActivoHardwareDTO activoAsignado = activoHardwareService.asignarAEmpleado(id, empleadoId);
        return ResponseEntity.ok(activoAsignado);
    }

    @PutMapping("/{id}/devolver")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<ActivoHardwareDTO> devolverActivo(@PathVariable Long id) {
        ActivoHardwareDTO activoDevuelto = activoHardwareService.marcarComoDisponible(id);
        return ResponseEntity.ok(activoDevuelto);
    }

    @GetMapping("/buscar/{terminoBusqueda}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR', 'USUARIO')")
    public ResponseEntity<List<ActivoHardwareDTO>> buscarActivos(@PathVariable String terminoBusqueda) {
        List<ActivoHardwareDTO> activos = activoHardwareService.buscarPorTermino(terminoBusqueda);
        return ResponseEntity.ok(activos);
    }
}