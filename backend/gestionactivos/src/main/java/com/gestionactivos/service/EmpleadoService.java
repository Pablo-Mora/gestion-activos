package com.gestionactivos.service;

import com.gestionactivos.dto.EmpleadoDTO;
import com.gestionactivos.model.Empleado;

import java.util.List;

public interface EmpleadoService {
    EmpleadoDTO crearEmpleado(EmpleadoDTO empleadoDTO);
    EmpleadoDTO actualizarEmpleado(Long id, EmpleadoDTO empleadoDTO);
    void eliminarEmpleado(Long id);
    EmpleadoDTO obtenerEmpleadoPorId(Long id);
    List<EmpleadoDTO> listarEmpleados();
    List<EmpleadoDTO> buscarEmpleadosPorDepartamento(String departamento);
    List<EmpleadoDTO> buscarEmpleadosPorCargo(String cargo);
}