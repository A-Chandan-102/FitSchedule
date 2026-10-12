package com.FitSchedule.backend.config;

import com.FitSchedule.backend.entity.Exercise;
import com.FitSchedule.backend.repository.ExerciseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

import com.FitSchedule.backend.entity.Trainer;
import com.FitSchedule.backend.entity.User;
import com.FitSchedule.backend.repository.TrainerRepository;
import com.FitSchedule.backend.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ExerciseRepository exerciseRepository;
    private final TrainerRepository trainerRepository;
    private final UserRepository userRepository;

    public DataInitializer(ExerciseRepository exerciseRepository,
                           TrainerRepository trainerRepository,
                           UserRepository userRepository) {
        this.exerciseRepository = exerciseRepository;
        this.trainerRepository = trainerRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        seedTrainersAndUsers();

        if (exerciseRepository.count() > 0) {
            return; // Seed exercises already present
        }

        List<Exercise> exercises = Arrays.asList(
                // CHEST
                Exercise.builder()
                        .name("Barbell Bench Press")
                        .muscleGroup("Chest")
                        .category("Compound")
                        .equipment("Full gym")
                        .experienceLevel("All")
                        .description("Lie on bench, grip bar slightly wider than shoulder width, lower bar to mid-chest, press upward.")
                        .defaultSets(4).defaultReps("8-10").defaultRestSeconds(90)
                        .build(),
                Exercise.builder()
                        .name("Incline Dumbbell Press")
                        .muscleGroup("Chest")
                        .category("Compound")
                        .equipment("Dumbbells")
                        .experienceLevel("All")
                        .description("Set bench to 30-45 degrees, press dumbbells upward focusing on upper chest contraction.")
                        .defaultSets(3).defaultReps("10-12").defaultRestSeconds(75)
                        .build(),
                Exercise.builder()
                        .name("Standard Push-Ups")
                        .muscleGroup("Chest")
                        .category("Compound")
                        .equipment("Bodyweight only")
                        .experienceLevel("All")
                        .description("Maintain a straight plank posture, lower chest near floor, press up firmly.")
                        .defaultSets(3).defaultReps("12-15").defaultRestSeconds(60)
                        .build(),
                Exercise.builder()
                        .name("Dumbbell Chest Fly")
                        .muscleGroup("Chest")
                        .category("Isolation")
                        .equipment("Dumbbells")
                        .experienceLevel("Intermediate")
                        .description("Lie on flat bench, open arms in wide arc with slight elbow bend, squeeze pecs together at top.")
                        .defaultSets(3).defaultReps("12-15").defaultRestSeconds(60)
                        .build(),
                Exercise.builder()
                        .name("Cable Crossover")
                        .muscleGroup("Chest")
                        .category("Isolation")
                        .equipment("Full gym")
                        .experienceLevel("Intermediate")
                        .description("Pull cables forward and down in an arc, feeling deep stretch and contraction across pecs.")
                        .defaultSets(3).defaultReps("12-15").defaultRestSeconds(60)
                        .build(),
                Exercise.builder()
                        .name("Banded Chest Press")
                        .muscleGroup("Chest")
                        .category("Compound")
                        .equipment("Resistance bands")
                        .experienceLevel("Beginner")
                        .description("Anchor band behind back or pole, press handles forward to peak contraction.")
                        .defaultSets(3).defaultReps("15-20").defaultRestSeconds(45)
                        .build(),
                Exercise.builder()
                        .name("Decline Push-Ups")
                        .muscleGroup("Chest")
                        .category("Compound")
                        .equipment("Bodyweight only")
                        .experienceLevel("Intermediate")
                        .description("Place feet on bench or elevated surface, lower chest to ground to emphasize upper pectorals.")
                        .defaultSets(3).defaultReps("10-12").defaultRestSeconds(60)
                        .build(),

                // BACK
                Exercise.builder()
                        .name("Barbell Deadlift")
                        .muscleGroup("Back")
                        .category("Compound")
                        .equipment("Full gym")
                        .experienceLevel("Intermediate")
                        .description("Hinge at hips, grip barbell, drive through feet extending hips and knees in unison.")
                        .defaultSets(4).defaultReps("5-6").defaultRestSeconds(120)
                        .build(),
                Exercise.builder()
                        .name("Pull-Ups")
                        .muscleGroup("Back")
                        .category("Compound")
                        .equipment("Bodyweight only")
                        .experienceLevel("Intermediate")
                        .description("Overhand grip on bar, pull body upward until chin clears bar, lower under control.")
                        .defaultSets(3).defaultReps("8-10").defaultRestSeconds(90)
                        .build(),
                Exercise.builder()
                        .name("Lat Pulldown")
                        .muscleGroup("Back")
                        .category("Compound")
                        .equipment("Full gym")
                        .experienceLevel("All")
                        .description("Grip wide bar, pull down toward collarbone squeezing lats, return smoothly.")
                        .defaultSets(3).defaultReps("10-12").defaultRestSeconds(75)
                        .build(),
                Exercise.builder()
                        .name("Single-Arm Dumbbell Row")
                        .muscleGroup("Back")
                        .category("Compound")
                        .equipment("Dumbbells")
                        .experienceLevel("All")
                        .description("One knee on bench, pull dumbbell to hip level keeping back flat and core tight.")
                        .defaultSets(3).defaultReps("10-12").defaultRestSeconds(60)
                        .build(),
                Exercise.builder()
                        .name("Barbell Bent-Over Row")
                        .muscleGroup("Back")
                        .category("Compound")
                        .equipment("Full gym")
                        .experienceLevel("Intermediate")
                        .description("Hinge forward 45 degrees, pull barbell to lower ribcage pinching shoulder blades.")
                        .defaultSets(4).defaultReps("8-10").defaultRestSeconds(90)
                        .build(),
                Exercise.builder()
                        .name("Resistance Band Lat Row")
                        .muscleGroup("Back")
                        .category("Compound")
                        .equipment("Resistance bands")
                        .experienceLevel("Beginner")
                        .description("Anchor band at chest height, pull elbows back while engaging shoulder blades.")
                        .defaultSets(3).defaultReps("15").defaultRestSeconds(45)
                        .build(),
                Exercise.builder()
                        .name("Inverted Bodyweight Row")
                        .muscleGroup("Back")
                        .category("Compound")
                        .equipment("Bodyweight only")
                        .experienceLevel("Beginner")
                        .description("Hang under waist-height bar, pull chest to bar keeping straight body line.")
                        .defaultSets(3).defaultReps("10-12").defaultRestSeconds(60)
                        .build(),

                // LEGS
                Exercise.builder()
                        .name("Barbell Back Squat")
                        .muscleGroup("Legs")
                        .category("Compound")
                        .equipment("Full gym")
                        .experienceLevel("All")
                        .description("Barbell on traps, sit back and down into parallel squat, drive through mid-foot.")
                        .defaultSets(4).defaultReps("6-8").defaultRestSeconds(120)
                        .build(),
                Exercise.builder()
                        .name("Goblet Squat")
                        .muscleGroup("Legs")
                        .category("Compound")
                        .equipment("Dumbbells")
                        .experienceLevel("All")
                        .description("Hold dumbbell vertically at chest, squat deep keeping upright torso.")
                        .defaultSets(3).defaultReps("10-12").defaultRestSeconds(60)
                        .build(),
                Exercise.builder()
                        .name("Romanian Deadlift")
                        .muscleGroup("Legs")
                        .category("Compound")
                        .equipment("Dumbbells")
                        .experienceLevel("All")
                        .description("Soft knees, push hips back to stretch hamstrings, squeeze glutes to stand.")
                        .defaultSets(3).defaultReps("10-12").defaultRestSeconds(75)
                        .build(),
                Exercise.builder()
                        .name("Bulgarian Split Squat")
                        .muscleGroup("Legs")
                        .category("Compound")
                        .equipment("Dumbbells")
                        .experienceLevel("Intermediate")
                        .description("Rear foot elevated on bench, drop back knee toward floor, press through front heel.")
                        .defaultSets(3).defaultReps("8-10 per leg").defaultRestSeconds(60)
                        .build(),
                Exercise.builder()
                        .name("Bodyweight Air Squats")
                        .muscleGroup("Legs")
                        .category("Compound")
                        .equipment("Bodyweight only")
                        .experienceLevel("Beginner")
                        .description("Feet shoulder-width apart, sink into full squat, keep chest proud.")
                        .defaultSets(3).defaultReps("15-20").defaultRestSeconds(45)
                        .build(),
                Exercise.builder()
                        .name("Walking Lunges")
                        .muscleGroup("Legs")
                        .category("Compound")
                        .equipment("Bodyweight only")
                        .experienceLevel("All")
                        .description("Step forward into lunge, knees at 90 degrees, alternate legs continuously.")
                        .defaultSets(3).defaultReps("12 per leg").defaultRestSeconds(60)
                        .build(),
                Exercise.builder()
                        .name("Banded Glute Bridges")
                        .muscleGroup("Legs")
                        .category("Isolation")
                        .equipment("Resistance bands")
                        .experienceLevel("Beginner")
                        .description("Band around thighs above knees, lie supine, bridge hips upward squeezing glutes.")
                        .defaultSets(3).defaultReps("15-20").defaultRestSeconds(45)
                        .build(),
                Exercise.builder()
                        .name("Standing Calf Raises")
                        .muscleGroup("Legs")
                        .category("Isolation")
                        .equipment("Dumbbells")
                        .experienceLevel("All")
                        .description("Rise on balls of feet, hold peak calf contraction 1 second, lower with control.")
                        .defaultSets(4).defaultReps("15-20").defaultRestSeconds(45)
                        .build(),

                // SHOULDERS
                Exercise.builder()
                        .name("Overhead Barbell Press")
                        .muscleGroup("Shoulders")
                        .category("Compound")
                        .equipment("Full gym")
                        .experienceLevel("Intermediate")
                        .description("Barbell at collarbone, brace core, press straight overhead locking out elbows.")
                        .defaultSets(4).defaultReps("6-8").defaultRestSeconds(90)
                        .build(),
                Exercise.builder()
                        .name("Dumbbell Shoulder Press")
                        .muscleGroup("Shoulders")
                        .category("Compound")
                        .equipment("Dumbbells")
                        .experienceLevel("All")
                        .description("Seated or standing, press dumbbells overhead in smooth vertical arc.")
                        .defaultSets(3).defaultReps("10-12").defaultRestSeconds(60)
                        .build(),
                Exercise.builder()
                        .name("Dumbbell Lateral Raise")
                        .muscleGroup("Shoulders")
                        .category("Isolation")
                        .equipment("Dumbbells")
                        .experienceLevel("All")
                        .description("Raise dumbbells laterally to shoulder level with slight elbow bend, control descent.")
                        .defaultSets(3).defaultReps("12-15").defaultRestSeconds(45)
                        .build(),
                Exercise.builder()
                        .name("Pike Push-Ups")
                        .muscleGroup("Shoulders")
                        .category("Compound")
                        .equipment("Bodyweight only")
                        .experienceLevel("Intermediate")
                        .description("Hips elevated in inverted V shape, lower crown of head toward floor, press up.")
                        .defaultSets(3).defaultReps("8-10").defaultRestSeconds(60)
                        .build(),
                Exercise.builder()
                        .name("Banded Face Pulls")
                        .muscleGroup("Shoulders")
                        .category("Isolation")
                        .equipment("Resistance bands")
                        .experienceLevel("All")
                        .description("Pull band toward eyes with high elbows, rotating hands backward for rear delt engagement.")
                        .defaultSets(3).defaultReps("15-20").defaultRestSeconds(45)
                        .build(),

                // ARMS (BICEPS & TRICEPS)
                Exercise.builder()
                        .name("Dumbbell Bicep Curls")
                        .muscleGroup("Arms")
                        .category("Isolation")
                        .equipment("Dumbbells")
                        .experienceLevel("All")
                        .description("Stand tall, curl dumbbells with palms up, avoiding swinging elbows.")
                        .defaultSets(3).defaultReps("10-12").defaultRestSeconds(60)
                        .build(),
                Exercise.builder()
                        .name("Tricep Rope Pushdown")
                        .muscleGroup("Arms")
                        .category("Isolation")
                        .equipment("Full gym")
                        .experienceLevel("All")
                        .description("Pin elbows at sides, push rope down and spread handles at bottom.")
                        .defaultSets(3).defaultReps("12-15").defaultRestSeconds(60)
                        .build(),
                Exercise.builder()
                        .name("Overhead Dumbbell Tricep Extension")
                        .muscleGroup("Arms")
                        .category("Isolation")
                        .equipment("Dumbbells")
                        .experienceLevel("All")
                        .description("Hold dumbbell overhead with both hands, lower behind head, extend elbows upward.")
                        .defaultSets(3).defaultReps("10-12").defaultRestSeconds(60)
                        .build(),
                Exercise.builder()
                        .name("Diamond Push-Ups")
                        .muscleGroup("Arms")
                        .category("Compound")
                        .equipment("Bodyweight only")
                        .experienceLevel("Intermediate")
                        .description("Hands close together in diamond formation under chest, emphasizes triceps.")
                        .defaultSets(3).defaultReps("10-12").defaultRestSeconds(60)
                        .build(),
                Exercise.builder()
                        .name("Banded Bicep Curls")
                        .muscleGroup("Arms")
                        .category("Isolation")
                        .equipment("Resistance bands")
                        .experienceLevel("Beginner")
                        .description("Step on center of band, curl handles upward with controlled tempo.")
                        .defaultSets(3).defaultReps("15").defaultRestSeconds(45)
                        .build(),
                Exercise.builder()
                        .name("Bench Dips")
                        .muscleGroup("Arms")
                        .category("Compound")
                        .equipment("Bodyweight only")
                        .experienceLevel("Beginner")
                        .description("Hands behind you on bench edge, lower hips bending elbows to 90 degrees, press up.")
                        .defaultSets(3).defaultReps("12-15").defaultRestSeconds(60)
                        .build(),

                // CORE
                Exercise.builder()
                        .name("Forearm Plank")
                        .muscleGroup("Core")
                        .category("Isometric")
                        .equipment("Bodyweight only")
                        .experienceLevel("All")
                        .description("Elbows under shoulders, lock glutes and abdomen, hold steady spine alignment.")
                        .defaultSets(3).defaultReps("45-60 sec").defaultRestSeconds(45)
                        .build(),
                Exercise.builder()
                        .name("Hanging Leg Raises")
                        .muscleGroup("Core")
                        .category("Isolation")
                        .equipment("Full gym")
                        .experienceLevel("Intermediate")
                        .description("Hang from bar, raise legs toward horizontal without excessive swinging.")
                        .defaultSets(3).defaultReps("10-12").defaultRestSeconds(60)
                        .build(),
                Exercise.builder()
                        .name("Bicycle Crunches")
                        .muscleGroup("Core")
                        .category("Isolation")
                        .equipment("Bodyweight only")
                        .experienceLevel("All")
                        .description("Lie supine, bring opposite elbow to knee while extending other leg.")
                        .defaultSets(3).defaultReps("20 total").defaultRestSeconds(45)
                        .build(),
                Exercise.builder()
                        .name("Russian Twists")
                        .muscleGroup("Core")
                        .category("Isolation")
                        .equipment("Dumbbells")
                        .experienceLevel("All")
                        .description("Sit with torso tilted 45 degrees, rotate dumbbell across hips from side to side.")
                        .defaultSets(3).defaultReps("20 total").defaultRestSeconds(45)
                        .build(),
                Exercise.builder()
                        .name("Mountain Climbers")
                        .muscleGroup("Core")
                        .category("Cardio/Core")
                        .equipment("Bodyweight only")
                        .experienceLevel("All")
                        .description("Push-up position, alternate driving knees rapidly toward chest.")
                        .defaultSets(3).defaultReps("30-40 sec").defaultRestSeconds(45)
                        .build()
        );

        exerciseRepository.saveAll(exercises);
    }

    private void seedTrainersAndUsers() {
        if (trainerRepository.count() == 0) {
            List<Trainer> trainers = Arrays.asList(
                    Trainer.builder()
                            .name("Marcus Vance")
                            .specialization("Strength Development & Powerlifting")
                            .experienceYears(8)
                            .email("marcus.vance@fitschedule.com")
                            .rating(4.9)
                            .bio("CSCS certified strength coach specializing in heavy compound periodization and powerlifting biomechanics.")
                            .avatarUrl("https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&fit=crop&crop=face")
                            .build(),
                    Trainer.builder()
                            .name("Sarah Jenkins")
                            .specialization("Hypertrophy & Physique Building")
                            .experienceYears(6)
                            .email("sarah.jenkins@fitschedule.com")
                            .rating(4.95)
                            .bio("Exercise science specialist focused on muscle hypertrophy, progressive overload volume, and aesthetic proportion.")
                            .avatarUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&fit=crop&crop=face")
                            .build(),
                    Trainer.builder()
                            .name("David Chen")
                            .specialization("Calisthenics & Joint Mobility")
                            .experienceYears(5)
                            .email("david.chen@fitschedule.com")
                            .rating(4.85)
                            .bio("Bodyweight gymnastics and mobility expert helping athletes build bulletproof joints and elite relative strength.")
                            .avatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop&crop=face")
                            .build(),
                    Trainer.builder()
                            .name("Elena Rostova")
                            .specialization("Fat Loss & Metabolic Conditioning")
                            .experienceYears(7)
                            .email("elena.rostova@fitschedule.com")
                            .rating(4.9)
                            .bio("High-intensity conditioning and sustainable fat loss coach specializing in metabolic work capacity.")
                            .avatarUrl("https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&fit=crop&crop=face")
                            .build()
            );
            trainerRepository.saveAll(trainers);
        }

        if (userRepository.count() == 0) {
            List<User> demoUsers = Arrays.asList(
                    User.builder()
                            .fullName("Demo Member")
                            .email("member@fitschedule.com")
                            .password("password123")
                            .role("MEMBER")
                            .build(),
                    User.builder()
                            .fullName("Marcus Vance (Coach)")
                            .email("trainer@fitschedule.com")
                            .password("trainer123")
                            .role("TRAINER")
                            .specialization("Strength Development & Powerlifting")
                            .build()
            );
            userRepository.saveAll(demoUsers);
        }
    }
}
