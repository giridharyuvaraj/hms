package com.hms.controller;

import com.hms.entity.Role;
import com.hms.entity.User;
import com.hms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    // ----- Auth -----
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        Optional<User> user = userRepository.findByEmailAndPassword(email, password);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
    }

    // ----- Doctors (public search) -----
    @GetMapping("/users/doctors")
    public List<User> searchDoctors(@RequestParam(required = false) String specialization) {
        if (specialization != null && !specialization.isEmpty()) {
            return userRepository.findByRoleAndSpecializationContainingIgnoreCase(Role.DOCTOR, specialization);
        }
        return userRepository.findByRole(Role.DOCTOR);
    }

    // ----- Doctor CRUD (admin) -----
    @PostMapping("/users/doctors")
    public ResponseEntity<User> createDoctor(@RequestBody User doctor) {
        doctor.setRole(Role.DOCTOR);
        if (doctor.getPassword() == null || doctor.getPassword().isEmpty()) {
            doctor.setPassword("doctor123");
        }
        return ResponseEntity.ok(userRepository.save(doctor));
    }

    @PutMapping("/users/doctors/{id}")
    public ResponseEntity<User> updateDoctor(@PathVariable Long id, @RequestBody User updatedDoctor) {
        return userRepository.findById(id).map(doctor -> {
            doctor.setName(updatedDoctor.getName());
            doctor.setSpecialization(updatedDoctor.getSpecialization());
            doctor.setDepartment(updatedDoctor.getDepartment());
            doctor.setFee(updatedDoctor.getFee());
            doctor.setExperience(updatedDoctor.getExperience());
            doctor.setEmail(updatedDoctor.getEmail());
            if (updatedDoctor.getPassword() != null && !updatedDoctor.getPassword().isEmpty()) {
                doctor.setPassword(updatedDoctor.getPassword());
            }
            return ResponseEntity.ok(userRepository.save(doctor));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/doctors/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ----- General user endpoints -----
    @PostMapping("/users/register")
    public User register(@RequestBody User user) {
        return userRepository.save(user);
    }

    @GetMapping("/users/{id}")
    public User getUser(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow();
    }
}
