package com.FitSchedule.backend.controller;

import com.FitSchedule.backend.dto.AuthResponse;
import com.FitSchedule.backend.dto.LoginRequest;
import com.FitSchedule.backend.dto.RegisterRequest;
import com.FitSchedule.backend.entity.Trainer;
import com.FitSchedule.backend.entity.User;
import com.FitSchedule.backend.exception.BadRequestException;
import com.FitSchedule.backend.repository.TrainerRepository;
import com.FitSchedule.backend.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password."));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new BadRequestException("Invalid email or password.");
        }

        String token = "FS-" + UUID.randomUUID().toString();

        AuthResponse response = AuthResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .specialization(user.getSpecialization())
                .token(token)
                .message("Login successful")
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists.");
        }

        String role = (request.getRole() != null && request.getRole().equalsIgnoreCase("TRAINER"))
                ? "TRAINER"
                : "MEMBER";

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase())
                .password(request.getPassword())
                .role(role)
                .specialization(request.getSpecialization())
                .build();

        User saved = userRepository.save(user);

        // If registered as trainer, also ensure presence in trainers directory
        if ("TRAINER".equals(role)) {
            Trainer trainer = Trainer.builder()
                    .name(saved.getFullName())
                    .email(saved.getEmail())
                    .specialization(request.getSpecialization() != null ? request.getSpecialization() : "Certified Personal Trainer")
                    .experienceYears(3)
                    .bio("Experienced certified trainer ready to guide your journey.")
                    .rating(4.9)
                    .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
                    .build();
            trainerRepository.save(trainer);
        }

        String token = "FS-" + UUID.randomUUID().toString();

        AuthResponse response = AuthResponse.builder()
                .id(saved.getId())
                .fullName(saved.getFullName())
                .email(saved.getEmail())
                .role(saved.getRole())
                .specialization(saved.getSpecialization())
                .token(token)
                .message("Account created successfully")
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
