package com.hms;

import com.hms.entity.AvailableSlot;
import com.hms.entity.Role;
import com.hms.entity.User;
import com.hms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed Admin
        updateOrCreateUser("Admin", "admin@smarthimis.com", "admin123", Role.ADMIN, null, null, null, null);

        // Seed Doctors
        updateOrCreateDoctor("Dr. V. Mohan", "v.mohan@smarthimis.com", "doctor123", "Diabetology", "Diabetes & Endocrinology", 800.0, "40+ years", 10);
        updateOrCreateDoctor("Dr. Hari", "hari@smarthimis.com", "doctor123", "ENT", "Ear, Nose & Throat", 600.0, "35+ years", 8);
        updateOrCreateDoctor("Dr. S.Badrinath", "s.badrinath@smarthimis.com", "doctor123", "Ophthalmology", "Eye Care", 700.0, "45+ years", 12);
        updateOrCreateDoctor("Dr. Manjula", "manjula@smarthimis.com", "doctor123", "Neurosurgery", "Neurosciences", 1200.0, "30+ years", 15);

        // Seed Patient
        updateOrCreateUser("Giri", "giri@smarthimis.com", "patient123", Role.PATIENT, null, null, null, null);

        System.out.println("SmartHMIS: Data seeding/update completed.");
    }

    private void updateOrCreateUser(String name, String email, String password, Role role, String specialization, String department, Double fee, String experience) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        User user = existingUser.orElse(new User());
        user.setName(name);
        user.setEmail(email);
        // Always re-encode to be sure it's BCrypt
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setSpecialization(specialization);
        user.setDepartment(department);
        user.setFee(fee);
        user.setExperience(experience);
        userRepository.save(user);
    }

    private void updateOrCreateDoctor(String name, String email, String password, String spec, String dept, Double fee, String exp, Integer slotCapacity) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isEmpty()) {
            User doctor = new User();
            doctor.setName(name);
            doctor.setEmail(email);
            doctor.setPassword(passwordEncoder.encode(password));
            doctor.setRole(Role.DOCTOR);
            doctor.setSpecialization(spec);
            doctor.setDepartment(dept);
            doctor.setFee(fee);
            doctor.setExperience(exp);

            List<AvailableSlot> slots = new ArrayList<>();
            slots.add(new AvailableSlot(null, LocalDate.now(), LocalTime.of(9,0), LocalTime.of(12,0), slotCapacity, 0));
            slots.add(new AvailableSlot(null, LocalDate.now().plusDays(1), LocalTime.of(14,0), LocalTime.of(17,0), slotCapacity, 0));
            
            doctor.setAvailableSlots(slots);
            userRepository.save(doctor);
        } else {
            User doctor = existingUser.get();
            doctor.setPassword(passwordEncoder.encode(password));
            userRepository.save(doctor);
        }
    }
}