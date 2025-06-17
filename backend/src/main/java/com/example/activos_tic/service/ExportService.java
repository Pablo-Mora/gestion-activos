package com.example.activos_tic.service;

import com.example.activos_tic.domain.model.Employee;
import com.example.activos_tic.domain.model.Hardware;
import com.example.activos_tic.domain.model.License;
import com.example.activos_tic.domain.model.WebAccess;
import com.example.activos_tic.domain.repository.EmployeeRepository;
import com.example.activos_tic.domain.repository.HardwareRepository;
import com.example.activos_tic.domain.repository.LicenseRepository;
import com.example.activos_tic.domain.repository.WebAccessRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExportService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private HardwareRepository hardwareRepository;

    @Autowired
    private LicenseRepository licenseRepository;

    @Autowired
    private WebAccessRepository webAccessRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public ByteArrayInputStream exportAllDataToExcel() throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Create Employee Sheet
            Sheet employeeSheet = workbook.createSheet("Employees");
            String[] employeeHeaders = {"ID", "Name", "Department", "Position"};
            createHeaderRow(employeeSheet, employeeHeaders);
            List<Employee> employees = employeeRepository.findAll();
            int rowNum = 1;
            for (Employee employee : employees) {
                Row row = employeeSheet.createRow(rowNum++);
                row.createCell(0).setCellValue(employee.getId());
                row.createCell(1).setCellValue(employee.getName());
                row.createCell(2).setCellValue(employee.getDepartment());
                row.createCell(3).setCellValue(employee.getPosition());
            }

            // Create Hardware Sheet
            Sheet hardwareSheet = workbook.createSheet("Hardware");
            String[] hardwareHeaders = {"ID", "Type", "Brand", "Serial Number", "Location", "Assigned Employee ID", "Assigned Employee Name"};
            createHeaderRow(hardwareSheet, hardwareHeaders);
            List<Hardware> hardwareList = hardwareRepository.findAll();
            rowNum = 1;
            for (Hardware hardware : hardwareList) {
                Row row = hardwareSheet.createRow(rowNum++);
                row.createCell(0).setCellValue(hardware.getId());
                row.createCell(1).setCellValue(hardware.getType());
                row.createCell(2).setCellValue(hardware.getBrand());
                row.createCell(3).setCellValue(hardware.getSerialNumber());
                row.createCell(4).setCellValue(hardware.getLocation());
                if (hardware.getAssignedEmployee() != null) {
                    row.createCell(5).setCellValue(hardware.getAssignedEmployee().getId());
                    row.createCell(6).setCellValue(hardware.getAssignedEmployee().getName());
                }
            }

            // Create License Sheet
            Sheet licenseSheet = workbook.createSheet("Licenses");
            String[] licenseHeaders = {"ID", "Software Name", "License Key", "Purchase Date", "Expiration Date", "Assigned Employee ID", "Assigned Employee Name"};
            createHeaderRow(licenseSheet, licenseHeaders);
            List<License> licenses = licenseRepository.findAll();
            rowNum = 1;
            for (License license : licenses) {
                Row row = licenseSheet.createRow(rowNum++);
                row.createCell(0).setCellValue(license.getId());
                row.createCell(1).setCellValue(license.getSoftwareName());
                row.createCell(2).setCellValue(license.getLicenseKey());
                row.createCell(3).setCellValue(license.getPurchaseDate() != null ? license.getPurchaseDate().format(DATE_FORMATTER) : "");
                row.createCell(4).setCellValue(license.getExpirationDate() != null ? license.getExpirationDate().format(DATE_FORMATTER) : "");
                if (license.getAssignedEmployee() != null) {
                    row.createCell(5).setCellValue(license.getAssignedEmployee().getId());
                    row.createCell(6).setCellValue(license.getAssignedEmployee().getName());
                }
            }

            // Create Web Access Sheet
            Sheet webAccessSheet = workbook.createSheet("Web Accesses");
            String[] webAccessHeaders = {"ID", "Service Name", "URL", "Username", "Assigned Employee ID", "Assigned Employee Name"};
            // Note: Password is intentionally excluded from export for security
            createHeaderRow(webAccessSheet, webAccessHeaders);
            List<WebAccess> webAccesses = webAccessRepository.findAll();
            rowNum = 1;
            for (WebAccess webAccess : webAccesses) {
                Row row = webAccessSheet.createRow(rowNum++);
                row.createCell(0).setCellValue(webAccess.getId());
                row.createCell(1).setCellValue(webAccess.getServiceName());
                row.createCell(2).setCellValue(webAccess.getUrl());
                row.createCell(3).setCellValue(webAccess.getAccessUsername());
                if (webAccess.getAssignedEmployee() != null) {
                    row.createCell(4).setCellValue(webAccess.getAssignedEmployee().getId());
                    row.createCell(5).setCellValue(webAccess.getAssignedEmployee().getName());
                }
            }

            // Auto-size columns for readability
            autoSizeColumns(employeeSheet, employeeHeaders.length);
            autoSizeColumns(hardwareSheet, hardwareHeaders.length);
            autoSizeColumns(licenseSheet, licenseHeaders.length);
            autoSizeColumns(webAccessSheet, webAccessHeaders.length);

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    private void createHeaderRow(Sheet sheet, String[] headers) {
        Row headerRow = sheet.createRow(0);
        CellStyle headerCellStyle = sheet.getWorkbook().createCellStyle();
        Font headerFont = sheet.getWorkbook().createFont();
        headerFont.setBold(true);
        headerCellStyle.setFont(headerFont);

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerCellStyle);
        }
    }

    private void autoSizeColumns(Sheet sheet, int numColumns) {
        for (int i = 0; i < numColumns; i++) {
            sheet.autoSizeColumn(i);
        }
    }
}
