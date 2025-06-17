package com.example.activos_tic.controller;

import com.example.activos_tic.dto.LicenseDto;
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
@RequestMapping("/api/licenses")
public class LicenseController {

    @Autowired
    private AssetService assetService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LicenseDto> createLicense(@Valid @RequestBody LicenseDto licenseDto) {
        LicenseDto createdLicense = assetService.createLicense(licenseDto);
        return new ResponseEntity<>(createdLicense, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<LicenseDto>> getAllLicenses() {
        List<LicenseDto> licenses = assetService.getAllLicenses();
        return ResponseEntity.ok(licenses);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<LicenseDto> getLicenseById(@PathVariable Long id) {
        LicenseDto license = assetService.getLicenseById(id);
        return ResponseEntity.ok(license);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LicenseDto> updateLicense(@PathVariable Long id, @Valid @RequestBody LicenseDto licenseDto) {
        LicenseDto updatedLicense = assetService.updateLicense(id, licenseDto);
        return ResponseEntity.ok(updatedLicense);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLicense(@PathVariable Long id) {
        assetService.deleteLicense(id);
        return ResponseEntity.noContent().build();
    }
}
