package com.hms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String specialization; // For DOCTOR
    private String department;     // For DOCTOR/ADMIN
    private Double fee;            // For DOCTOR
    private String experience;     // For DOCTOR (e.g., "10 years")
    private String email;          // For login
    private String password;       // For login (plain text for demo)

    @ElementCollection
    @CollectionTable(name = "doctor_slots", joinColumns = @JoinColumn(name = "doctor_id"))
    private List<AvailableSlot> availableSlots = new ArrayList<>();
}
