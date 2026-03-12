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
        User doctor = userRepository.findById(appointment.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // 1. Find the matching slot and verify availability/capacity
        AvailableSlot matchingSlot = doctor.getAvailableSlots().stream()
                .filter(slot -> slot.getDate().equals(appointment.getAppointmentDate()) &&
                        !appointment.getStartTime().isBefore(slot.getStartTime()) &&
                        !appointment.getEndTime().isAfter(slot.getEndTime()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Doctor is not available at the selected time"));

        if (matchingSlot.getBookedCount() != null && matchingSlot.getCapacity() != null &&
            matchingSlot.getBookedCount() >= matchingSlot.getCapacity()) {
            throw new RuntimeException("This slot is already full");
        }

        // 2. Check for exact overlap (if multiple patients can be in one slot, we don't need this, 
        // but we should still check if THIS SPECIFIC patient has an overlap)
        // Actually, the user wants "slot for how many members he can see", 
        // so multiple patients per slot is allowed up to capacity.
        // We only check if the SAME patient already has an appointment.

        // 3. Check patient overlap
        List<Appointment> patientOverlaps = appointmentRepository.findOverlappingPatientAppointments(
                appointment.getPatientId(), appointment.getAppointmentDate(),
                appointment.getStartTime(), appointment.getEndTime());
        if (!patientOverlaps.isEmpty()) {
            throw new RuntimeException("Patient has another appointment at this time");
        }

        // 4. Update slot count and book
        matchingSlot.setBookedCount((matchingSlot.getBookedCount() == null ? 0 : matchingSlot.getBookedCount()) + 1);
        userRepository.save(doctor); // This should cascade if using proper JPA annotations

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
