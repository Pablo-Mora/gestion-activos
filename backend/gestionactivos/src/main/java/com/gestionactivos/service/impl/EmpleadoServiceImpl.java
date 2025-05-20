package com.gestionactivos.service.impl;

import com.gestionactivos.dto.EmpleadoDTO;
import com.gestionactivos.exception.ResourceNotFoundException;
import com.gestionactivos.model.Empleado;
import com.gestionactivos.repository.EmpleadoRepository;
import com.gestionactivos.service.EmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmpleadoServiceImpl implements EmpleadoService {

    private final EmpleadoRepository empleadoRepository;

    @Autowired
    public EmpleadoServiceImpl(EmpleadoRepository empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

    @Override
    public EmpleadoDTO crearEmpleado(EmpleadoDTO empleadoDTO) {
        Empleado empleado = convertirAEntidad(empleadoDTO);
        Empleado empleadoGuardado = empleadoRepository.save(empleado);
        return convertirADTO(empleadoGuardado);
    }

    @Override
    public EmpleadoDTO actualizarEmpleado(Long id, EmpleadoDTO empleadoDTO) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con ID: " + id));

        empleado.setNombre(empleadoDTO.getNombre());
        empleado.setApellido(empleadoDTO.getApellido());
        empleado.setEmail(empleadoDTO.getEmail());
        empleado.setDepartamento(empleadoDTO.getDepartamento());
        empleado.setCargo(empleadoDTO.getCargo());
        empleado.setTelefono(empleadoDTO.getTelefono());
        empleado.setFechaIngreso(empleadoDTO.getFechaIngreso());

        Empleado empleadoActualizado = empleadoRepository.save(empleado);
        return convertirADTO(empleadoActualizado);
    }

    @Override
    public void eliminarEmpleado(Long id) {
        if (!empleadoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Empleado no encontrado con ID: " + id);
        }
        empleadoRepository.deleteById(id);
    }

    @Override
    public EmpleadoDTO obtenerEmpleadoPorId(Long id) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con ID: " + id));
        return convertirADTO(empleado);
    }

    @Override
    public List<EmpleadoDTO> listarEmpleados() {
        List<Empleado> empleados = empleadoRepository.findAll();
        return empleados.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmpleadoDTO> buscarEmpleadosPorDepartamento(String departamento) {
        List<Empleado> empleados = empleadoRepository.findByDepartamentoContainingIgnoreCase(departamento);
        return empleados.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmpleadoDTO> buscarEmpleadosPorCargo(String cargo) {
        List<Empleado> empleados = empleadoRepository.findByCargoContainingIgnoreCase(cargo);
        return empleados.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private Empleado convertirAEntidad(EmpleadoDTO empleadoDTO) {
        Empleado empleado = new Empleado();
        empleado.setId(empleadoDTO.getId());
        empleado.setNombre(empleadoDTO.getNombre());
        empleado.setApellido(empleadoDTO.getApellido());
        empleado.setEmail(empleadoDTO.getEmail());
        empleado.setDepartamento(empleadoDTO.getDepartamento());
        empleado.setCargo(empleadoDTO.getCargo());
        empleado.setTelefono(empleadoDTO.getTelefono());
        empleado.setFechaIngreso(empleadoDTO.getFechaIngreso());
        return empleado;
    }

    private EmpleadoDTO convertirADTO(Empleado empleado) {
        EmpleadoDTO empleadoDTO = new EmpleadoDTO();
        empleadoDTO.setId(empleado.getId());
        empleadoDTO.setNombre(empleado.getNombre());
        empleadoDTO.setApellido(empleado.getApellido());
        empleadoDTO.setEmail(empleado.getEmail());
        empleadoDTO.setDepartamento(empleado.getDepartamento());
        empleadoDTO.setCargo(empleado.getCargo());
        empleadoDTO.setTelefono(empleado.getTelefono());
        empleadoDTO.setFechaIngreso(empleado.getFechaIngreso());
        return empleadoDTO;
    }
}