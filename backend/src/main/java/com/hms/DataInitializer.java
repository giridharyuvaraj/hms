package com.hms;

import com.hms.entity.AvailableSlot;
import com.hms.entity.Role;
import com.hms.entity.User;
import com.hms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {

            // Admin
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@smarthimis.com");
            admin.setPassword("admin123");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);

            // Doctor 1 - Dr. V. Mohan (Diabetologist)
            User doctor1 = new User();
            doctor1.setName("Dr. V. Mohan");
            doctor1.setEmail("v.mohan@smarthimis.com");
            doctor1.setPassword("doctor123");
            doctor1.setRole(Role.DOCTOR);
            doctor1.setSpecialization("Diabetology");
            doctor1.setDepartment("Diabetes & Endocrinology");
            doctor1.setFee(800.0);
            doctor1.setExperience("40+ years");
            List<AvailableSlot> slots1 = new ArrayList<>();
            slots1.add(new AvailableSlot(LocalDate.now(), LocalTime.of(9, 0), LocalTime.of(12, 0)));
            slots1.add(new AvailableSlot(LocalDate.now().plusDays(1), LocalTime.of(14, 0), LocalTime.of(17, 0)));
            doctor1.setAvailableSlots(slots1);
            userRepository.save(doctor1);

            // Doctor 2 - Dr. Hari (ENT Specialist)
            User doctor2 = new User();
            doctor2.setName("Dr. Hari");
            doctor2.setEmail("hari@smarthimis.com");
            doctor2.setPassword("doctor123");
            doctor2.setRole(Role.DOCTOR);
            doctor2.setSpecialization("ENT");
            doctor2.setDepartment("Ear, Nose & Throat");
            doctor2.setFee(600.0);
            doctor2.setExperience("35+ years");
            List<AvailableSlot> slots2 = new ArrayList<>();
            slots2.add(new AvailableSlot(LocalDate.now(), LocalTime.of(10, 0), LocalTime.of(13, 0)));
            slots2.add(new AvailableSlot(LocalDate.now().plusDays(2), LocalTime.of(9, 0), LocalTime.of(12, 0)));
            doctor2.setAvailableSlots(slots2);
            userRepository.save(doctor2);

            // Doctor 3 - Dr. S. Badrinath (Ophthalmologist)
            User doctor3 = new User();
            doctor3.setName("Dr. S.Badrinath");
            doctor3.setEmail("s.badrinath@smarthimis.com");
            doctor3.setPassword("doctor123");
            doctor3.setRole(Role.DOCTOR);
            doctor3.setSpecialization("Ophthalmology");
            doctor3.setDepartment("Eye Care");
            doctor3.setFee(700.0);
            doctor3.setExperience("45+ years");
            List<AvailableSlot> slots3 = new ArrayList<>();
            slots3.add(new AvailableSlot(LocalDate.now(), LocalTime.of(11, 0), LocalTime.of(14, 0)));
            slots3.add(new AvailableSlot(LocalDate.now().plusDays(1), LocalTime.of(16, 0), LocalTime.of(18, 0)));
            doctor3.setAvailableSlots(slots3);
            userRepository.save(doctor3);

            // Doctor 4 - Dr. Manjula (Neurosurgeon)
            User doctor4 = new User();
            doctor4.setName("Dr. Manjula");
            doctor4.setEmail("manjula@smarthimis.com");
            doctor4.setPassword("doctor123");
            doctor4.setRole(Role.DOCTOR);
            doctor4.setSpecialization("Neurosurgery");
            doctor4.setDepartment("Neurosciences");
            doctor4.setFee(1200.0);
            doctor4.setExperience("30+ years");
            List<AvailableSlot> slots4 = new ArrayList<>();
            slots4.add(new AvailableSlot(LocalDate.now(), LocalTime.of(9, 0), LocalTime.of(11, 0)));
            slots4.add(new AvailableSlot(LocalDate.now().plusDays(3), LocalTime.of(14, 0), LocalTime.of(17, 0)));
            doctor4.setAvailableSlots(slots4);
            userRepository.save(doctor4);

            // Patient
            User patient = new User();
            patient.setName("Giri");
            patient.setEmail("giri@smarthimis.com");
            patient.setPassword("patient123");
            patient.setRole(Role.PATIENT);
            userRepository.save(patient);

            System.out.println("SmartHMIS: Initial data seeded with 4 specialist doctors, 1 admin, 1 patient.");
        }
    }
}