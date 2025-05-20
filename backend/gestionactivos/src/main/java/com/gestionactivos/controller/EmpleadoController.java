package com.gestionactivos.controller;

import com.gestionactivos.dto.ApiResponseDTO;
import com.gestionactivos.dto.EmpleadoDTO;
import com.gestionactivos.service.EmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    @Autowired
    public EmpleadoController(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<EmpleadoDTO>> crearEmpleado(@RequestBody EmpleadoDTO empleadoDTO) {
        EmpleadoDTO nuevoEmpleado = empleadoService.crearEmpleado(empleadoDTO);
        ApiResponseDTO<EmpleadoDTO> response = new ApiResponseDTO<>(
                true,
                "Empleado creado exitosamente",
                nuevoEmpleado
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<EmpleadoDTO>> actualizarEmpleado(
            @PathVariable Long id,
            @RequestBody EmpleadoDTO empleadoDTO) {
        EmpleadoDTO empleadoActualizado = empleadoService.actualizarEmpleado(id, empleadoDTO);
        ApiResponseDTO<EmpleadoDTO> response = new ApiResponseDTO<>(
                true,
                "Empleado actualizado exitosamente",
                empleadoActualizado
        );
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO<Void>> eliminarEmpleado(@PathVariable Long id) {
        empleadoService.eliminarEmpleado(id);
        ApiResponseDTO<Void> response = new ApiResponseDTO<>(
                true,
                "Empleado eliminado exitosamente",
                null
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USUARIO')")
    public ResponseEntity<ApiResponseDTO<EmpleadoDTO>> obtenerEmpleadoPorId(@PathVariable Long id) {
        EmpleadoDTO empleado = empleadoService.obtenerEmpleadoPorId(id);
        ApiResponseDTO<EmpleadoDTO> response = new ApiResponseDTO<>(
                true,
                "Empleado obtenido exitosamente",
                empleado
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USUARIO')")
    public ResponseEntity<ApiResponseDTO<List<EmpleadoDTO>>> listarEmpleados() {
        List<EmpleadoDTO> empleados = empleadoService.listarEmpleados();
        ApiResponseDTO<List<EmpleadoDTO>> response = new ApiResponseDTO<>(
                true,
                "Lista de empleados obtenida exitosamente",
                empleados
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/departamento/{departamento}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USUARIO')")
    public ResponseEntity<ApiResponseDTO<List<EmpleadoDTO>>> buscarPorDepartamento(
            @PathVariable String departamento) {
        List<EmpleadoDTO> empleados = empleadoService.buscarEmpleadosPorDepartamento(departamento);
        ApiResponseDTO<List<EmpleadoDTO>> response = new ApiResponseDTO<>(
                true,
                "Empleados filtrados por departamento: " + departamento,
                empleados
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/cargo/{cargo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USUARIO')")
    public ResponseEntity<ApiResponseDTO<List<EmpleadoDTO>>> buscarPorCargo(
            @PathVariable String cargo) {
        List<EmpleadoDTO> empleados = empleadoService.buscarEmpleadosPorCargo(cargo);
        ApiResponseDTO<List<EmpleadoDTO>> response = new ApiResponseDTO<>(
                true,
                "Empleados filtrados por cargo: " + cargo,
                empleados
        );
        return ResponseEntity.ok(response);
    }
}