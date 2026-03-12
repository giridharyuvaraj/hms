package com.hms.service;

import com.hms.entity.AppointmentStatus;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AggregationService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public Map<String, Long> getAppointmentsPerDoctor() {
        return appointmentRepository.findAll().stream()
                .collect(Collectors.groupingBy(a -> {
                    return userRepository.findById(a.getDoctorId())
                            .map(u -> u.getName())
                            .orElse("Unknown Doctor");
                }, Collectors.counting()));
    }

    public Map<String, Double> getRevenuePerDepartment() {
        return appointmentRepository.findAll().stream()
                .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                .collect(Collectors.groupingBy(a -> {
                    return userRepository.findById(a.getDoctorId())
                            .map(u -> u.getDepartment())
                            .orElse("General");
                }, Collectors.summingDouble(a -> {
                    return userRepository.findById(a.getDoctorId())
                            .map(u -> u.getFee())
                            .orElse(0.0);
                })));
    }
}
