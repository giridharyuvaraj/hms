package com.hms.controller;

import com.hms.service.AggregationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AggregationService aggregationService;

    @GetMapping("/reports/appointments-per-doctor")
    public Map<String, Long> getAppointmentsPerDoctor() {
        return aggregationService.getAppointmentsPerDoctor();
    }

    @GetMapping("/reports/revenue-per-department")
    public Map<String, Double> getRevenuePerDepartment() {
        return aggregationService.getRevenuePerDepartment();
    }
}
