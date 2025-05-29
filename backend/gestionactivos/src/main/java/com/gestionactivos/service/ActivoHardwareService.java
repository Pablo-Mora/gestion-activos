package com.gestionactivos.service;

import com.gestionactivos.dto.ActivoHardwareDTO;
import com.gestionactivos.model.enums.EstadoActivo;
import com.gestionactivos.model.enums.TipoActivo;

import java.util.List;

public interface ActivoHardwareService {
    ActivoHardwareDTO crearActivoHardware(ActivoHardwareDTO activoHardwareDTO);
    ActivoHardwareDTO actualizarActivoHardware(Long id, ActivoHardwareDTO activoHardwareDTO);
    void eliminarActivoHardware(Long id);

    List<ActivoHardwareDTO> listarTodosActivosHardware();

    ActivoHardwareDTO obtenerActivoHardwarePorId(Long id);
    List<ActivoHardwareDTO> listarActivosHardware();
    List<ActivoHardwareDTO> buscarActivosPorTipo(TipoActivo tipo);
    List<ActivoHardwareDTO> buscarActivosPorEstado(EstadoActivo estado);
    List<ActivoHardwareDTO> buscarActivosPorEmpleado(Long empleadoId);
    void asignarActivoAEmpleado(Long activoId, Long empleadoId);
    void cambiarEstadoActivo(Long activoId, EstadoActivo nuevoEstado);

    List<ActivoHardwareDTO> findAll();

    ActivoHardwareDTO findById(Long id);

    ActivoHardwareDTO save(ActivoHardwareDTO activoHardwareDTO);

    ActivoHardwareDTO update(ActivoHardwareDTO activoHardwareDTO);

    void delete(Long id);

    List<ActivoHardwareDTO> findByEstado(EstadoActivo estado);

    List<ActivoHardwareDTO> findByEmpleadoId(Long empleadoId);

    ActivoHardwareDTO asignarAEmpleado(Long id, Long empleadoId);

    ActivoHardwareDTO marcarComoDisponible(Long id);

    List<ActivoHardwareDTO> buscarPorTermino(String terminoBusqueda);
}