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
    private final org.springframework.security.authentication.AuthenticationManager authenticationManager;
    private final com.hms.security.JwtService jwtService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    // ---------------- LOGIN ----------------
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {

        String email = credentials.get("email");
        String password = credentials.get("password");

        authenticationManager.authenticate(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(email, password)
        );

        User user = userRepository.findByEmail(email).orElseThrow();
        String token = jwtService.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        ));

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("token", token);
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    // ---------------- SEARCH DOCTORS ----------------
    @GetMapping("/users/doctors")
    public List<User> searchDoctors(@RequestParam(required = false) String specialization) {

        if (specialization != null && !specialization.isEmpty()) {
            return userRepository
                    .findByRoleAndSpecializationContainingIgnoreCase(Role.DOCTOR, specialization);
        }

        return userRepository.findByRole(Role.DOCTOR);
    }

    // ---------------- CREATE DOCTOR ----------------
    @PostMapping("/users/doctors")
    public ResponseEntity<User> createDoctor(@RequestBody User doctor) {

        doctor.setRole(Role.DOCTOR);

        if (doctor.getPassword() == null || doctor.getPassword().isEmpty()) {
            doctor.setPassword(passwordEncoder.encode("doctor123"));
        } else {
            doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
        }

        User savedDoctor = userRepository.save(doctor);

        return ResponseEntity.ok(savedDoctor);
    }

    // ---------------- UPDATE DOCTOR ----------------
    @PutMapping("/users/doctors/{id}")
    public ResponseEntity<User> updateDoctor(
            @PathVariable Long id,
            @RequestBody User updatedDoctor) {

        Optional<User> optionalDoctor = userRepository.findById(id);

        if (optionalDoctor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User doctor = optionalDoctor.get();

        doctor.setName(updatedDoctor.getName());
        doctor.setSpecialization(updatedDoctor.getSpecialization());
        doctor.setDepartment(updatedDoctor.getDepartment());
        doctor.setFee(updatedDoctor.getFee());
        doctor.setExperience(updatedDoctor.getExperience());
        doctor.setEmail(updatedDoctor.getEmail());

        if (updatedDoctor.getPassword() != null && !updatedDoctor.getPassword().isEmpty()) {
            doctor.setPassword(passwordEncoder.encode(updatedDoctor.getPassword()));
        }

        User savedDoctor = userRepository.save(doctor);

        return ResponseEntity.ok(savedDoctor);
    }

    // ---------------- DELETE DOCTOR ----------------
    @DeleteMapping("/users/doctors/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {

        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        userRepository.deleteById(id);

        return ResponseEntity.ok().build();
    }

    // ---------------- REGISTER USER ----------------
    @PostMapping("/users/register")
    public ResponseEntity<User> register(@RequestBody User user) {

        if (user.getRole() == null) {
            user.setRole(Role.PATIENT);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }

    // ---------------- GET USER ----------------
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {

        Optional<User> user = userRepository.findById(id);

        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ---------------- ADD SLOT ----------------
    @PostMapping("/users/doctors/{id}/slots")
    public ResponseEntity<User> addSlot(@PathVariable Long id, @RequestBody com.hms.entity.AvailableSlot slot) {
        Optional<User> optionalDoctor = userRepository.findById(id);
        if (optionalDoctor.isEmpty() || optionalDoctor.get().getRole() != Role.DOCTOR) {
            return ResponseEntity.notFound().build();
        }
        User doctor = optionalDoctor.get();
        if (slot.getCapacity() == null) slot.setCapacity(10);
        if (slot.getBookedCount() == null) slot.setBookedCount(0);
        doctor.getAvailableSlots().add(slot);
        User savedDoctor = userRepository.save(doctor);
        return ResponseEntity.ok(savedDoctor);
    }
}