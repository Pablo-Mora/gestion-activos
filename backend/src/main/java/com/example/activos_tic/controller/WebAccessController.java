package com.example.activos_tic.controller;

import com.example.activos_tic.dto.WebAccessDto;
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
@RequestMapping("/api/web-accesses")
public class WebAccessController {

    @Autowired
    private AssetService assetService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WebAccessDto> createWebAccess(@Valid @RequestBody WebAccessDto webAccessDto) {
        WebAccessDto createdWebAccess = assetService.createWebAccess(webAccessDto);
        return new ResponseEntity<>(createdWebAccess, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<WebAccessDto>> getAllWebAccesses() {
        List<WebAccessDto> webAccesses = assetService.getAllWebAccesses();
        return ResponseEntity.ok(webAccesses);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<WebAccessDto> getWebAccessById(@PathVariable Long id) {
        WebAccessDto webAccess = assetService.getWebAccessById(id);
        return ResponseEntity.ok(webAccess);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WebAccessDto> updateWebAccess(@PathVariable Long id, @Valid @RequestBody WebAccessDto webAccessDto) {
        WebAccessDto updatedWebAccess = assetService.updateWebAccess(id, webAccessDto);
        return ResponseEntity.ok(updatedWebAccess);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteWebAccess(@PathVariable Long id) {
        assetService.deleteWebAccess(id);
        return ResponseEntity.noContent().build();
    }
}
