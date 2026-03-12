package com.hms.service;

import com.hms.entity.*;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    @Transactional
    public Appointment bookAppointment(Appointment appointment) {
        // 1. Verify doctor availability
        User doctor = userRepository.findById(appointment.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        boolean isSlotAvailable = doctor.getAvailableSlots().stream()
                .anyMatch(slot -> slot.getDate().equals(appointment.getAppointmentDate()) &&
                        !appointment.getStartTime().isBefore(slot.getStartTime()) &&
                        !appointment.getEndTime().isAfter(slot.getEndTime()));

        if (!isSlotAvailable) {
            throw new RuntimeException("Doctor is not available at the selected time");
        }

        // 2. Check doctor overlap
        List<Appointment> doctorOverlaps = appointmentRepository.findOverlappingDoctorAppointments(
                appointment.getDoctorId(), appointment.getAppointmentDate(),
                appointment.getStartTime(), appointment.getEndTime());
        if (!doctorOverlaps.isEmpty()) {
            throw new RuntimeException("Doctor has an overlapping appointment");
        }

        // 3. Check patient overlap
        List<Appointment> patientOverlaps = appointmentRepository.findOverlappingPatientAppointments(
                appointment.getPatientId(), appointment.getAppointmentDate(),
                appointment.getStartTime(), appointment.getEndTime());
        if (!patientOverlaps.isEmpty()) {
            throw new RuntimeException("Patient has another appointment at this time");
        }

        appointment.setStatus(AppointmentStatus.BOOKED);
        return appointmentRepository.save(appointment);
    }

    public Appointment confirmAppointment(Long appointmentId, Long doctorId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getDoctorId().equals(doctorId)) {
            throw new RuntimeException("Only the assigned doctor can confirm the appointment");
        }

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        return appointmentRepository.save(appointment);
    }

    public Appointment completeAppointment(Long appointmentId, Long doctorId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getDoctorId().equals(doctorId)) {
            throw new RuntimeException("Only the assigned doctor can complete the appointment");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);
        return appointmentRepository.save(appointment);
    }

    public Appointment cancelAppointment(Long appointmentId, Long adminId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != Role.ADMIN) {
             throw new RuntimeException("Only ADMIN can cancel after confirmation");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getDoctorSchedule(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }
}
