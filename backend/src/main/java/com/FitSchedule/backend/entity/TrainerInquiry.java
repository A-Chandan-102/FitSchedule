package com.FitSchedule.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "trainer_inquiries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerInquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @NotBlank(message = "Email address is required")
    @Email(message = "Please provide a valid email address")
    @Column(nullable = false, length = 120)
    private String email;

    @NotBlank(message = "Fitness goal or area of interest is required")
    @Column(name = "fitness_goal", nullable = false, length = 100)
    private String fitnessGoal;

    @NotBlank(message = "Message or question is required")
    @Size(min = 10, max = 2000, message = "Message must be between 10 and 2000 characters")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "trainer_id")
    private Long trainerId;

    @Column(name = "trainer_name", length = 100)
    private String trainerName;

    @Column(length = 30)
    @Builder.Default
    private String status = "SUBMITTED";

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        if (this.submittedAt == null) {
            this.submittedAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "SUBMITTED";
        }
    }
}
