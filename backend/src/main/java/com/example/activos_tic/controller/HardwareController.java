package com.example.activos_tic.controller;

import com.example.activos_tic.dto.HardwareDto;
import com.example.activos_tic.service.AssetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/hardware")
public class HardwareController {

    @Autowired
    private AssetService assetService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HardwareDto> createHardware(@Valid @RequestBody HardwareDto hardwareDto) {
        HardwareDto createdHardware = assetService.createHardware(hardwareDto);
        return new ResponseEntity<>(createdHardware, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<HardwareDto>> getAllHardware() {
        List<HardwareDto> hardwareList = assetService.getAllHardware();
        return ResponseEntity.ok(hardwareList);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<HardwareDto> getHardwareById(@PathVariable Long id) {
        HardwareDto hardware = assetService.getHardwareById(id);
        return ResponseEntity.ok(hardware);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HardwareDto> updateHardware(@PathVariable Long id, @Valid @RequestBody HardwareDto hardwareDto) {
        HardwareDto updatedHardware = assetService.updateHardware(id, hardwareDto);
        return ResponseEntity.ok(updatedHardware);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteHardware(@PathVariable Long id) {
        assetService.deleteHardware(id);
        return ResponseEntity.noContent().build();
    }
}
