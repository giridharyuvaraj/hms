package com.hms.controller;

import com.hms.entity.Appointment;
import com.hms.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/book")
    public Appointment book(@RequestBody Appointment appointment) {
        return appointmentService.bookAppointment(appointment);
    }

    @PutMapping("/{id}/confirm")
    public Appointment confirm(@PathVariable Long id, @RequestParam Long doctorId) {
        return appointmentService.confirmAppointment(id, doctorId);
    }

    @PutMapping("/{id}/complete")
    public Appointment complete(@PathVariable Long id, @RequestParam Long doctorId) {
        return appointmentService.completeAppointment(id, doctorId);
    }

    @PutMapping("/{id}/cancel")
    public Appointment cancel(@PathVariable Long id, @RequestParam Long adminId) {
        return appointmentService.cancelAppointment(id, adminId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getDoctorSchedule(@PathVariable Long doctorId) {
        return appointmentService.getDoctorSchedule(doctorId);
    }
}
