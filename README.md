# FitSchedule – Custom Workout Planning & Scheduling System

**FitSchedule** is a full-stack web application designed for personalized workout routine generation, weekly scheduling, exercise library exploration, and direct personal trainer consultation. Built with a **Spring Boot** REST backend, a **React (Vite)** frontend with a clean, light-themed responsive design, and a **MySQL** relational database.

---

## 📌 Table of Contents
- [What FitSchedule Does](#-what-fitschedule-does)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [How to Access the Database](#-how-to-access-the-database)
  - [Database Connection Details](#database-connection-details)
  - [Method 1: MySQL Command Line (CLI)](#method-1-mysql-command-line-cli)
  - [Method 2: MySQL Workbench or GUI Tools](#method-2-mysql-workbench-or-gui-tools)
  - [Database Schema & Tables](#database-schema--tables)
  - [Useful SQL Queries](#useful-sql-queries)
- [How to Run the Application](#-how-to-run-the-application)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup (Spring Boot)](#1-backend-setup-spring-boot)
  - [2. Frontend Setup (React + Vite)](#2-frontend-setup-react--vite)
- [Demo Credentials](#-demo-credentials)
- [REST API Endpoints](#-rest-api-endpoints)

---

## 🚀 What FitSchedule Does

FitSchedule solves the problem of generic, one-size-fits-all workout templates by providing:
1. **Rule-Based Routine Generation**: Generates customized training plans based on fitness goals (Muscle Gain, Fat Loss, Strength, Endurance), weekly frequency (2 to 6 days/week), available equipment (Full Gym, Dumbbells, Bodyweight), and split structures (Push/Pull/Legs, Upper/Lower, Full Body, Body Part Split).
2. **Weekly Timetable Scheduling**: Distributes workout days and rest days evenly across Monday through Sunday.
3. **Interactive Exercise Database**: Search and filter an extensive exercise catalog by target muscle group (Chest, Back, Legs, Shoulders, Arms, Core) and equipment, complete with technique cues and rep targets.
4. **Trainer Directory & Inquiries**: Allows members to review certified coaches, view their specializations, and send direct questions or consultation requests.
5. **Trainer Management Portal**: Trainers can log in to a dedicated portal to view incoming messages from members and track inquiry status (`SUBMITTED`, `REVIEWED`, `ANSWERED`).
6. **Account & Plan Persistence**: Members can sign in, save generated plans to their account, edit routines (change exercises, sets, reps), and access their saved workouts from any session.

---

## ✨ Key Features

- **Custom Workout Planner**: Select your goal, days per week, equipment, and preferred split. Preview the plan instantly and save it directly to MySQL.
- **My Workouts (Full CRUD)**:
  - **Create**: Generate and save new plans.
  - **Read**: View full daily exercise breakdowns and reps/sets.
  - **Update**: Edit workout names, descriptions, day titles, and individual exercise sets/reps.
  - **Delete**: Remove plans with confirmation safeguards.
- **Weekly Schedule View**: 7-day calendar layout showing active workout days vs. rest days with an interactive modal to inspect exercises scheduled for any day.
- **Exercise Database**:
  - Filterable by muscle group buttons: **Chest**, **Back**, **Legs**, **Shoulders**, **Arms**, **Core**, or **All**.
  - Secondary equipment filter: **Bodyweight**, **Dumbbells**, **Barbell**, **Cables**, **Full Gym**.
  - Live text search bar with movement instruction cues.
- **Trainer Consultation**:
  - Profiles for certified trainers displaying name, specialization, experience years, star rating, bio, and avatar.
  - Dedicated consultation form linked to the selected coach.
- **Authentication & Roles**:
  - User roles: `MEMBER` and `TRAINER`.
  - 1-click Quick Demo Login buttons for fast testing and demonstrations.
  - Trainer-only navigation link to **Trainer Portal** for inquiry tracking.

---

## 🛠 Technology Stack

### Backend
- **Java 21 / 26**
- **Spring Boot 3 / 4.1.1**
  - `spring-boot-starter-web` (REST APIs & CORS configuration)
  - `spring-boot-starter-data-jpa` (Hibernate ORM & Repositories)
  - `spring-boot-starter-validation` (Data validation)
- **MySQL Connector / J** (Relational persistence)
- **Lombok** (Boilerplate reduction)

### Frontend
- **React 19**
- **Vite** (Fast dev server & optimized bundler)
- **Vanilla CSS** (Custom responsive design, solid light-theme palette, zero heavy CSS frameworks)
- **Fetch API** (Asynchronous backend communication)

### Database
- **MySQL 8.0 Community Server** (`fitschedule` database)

---

## 📁 Project Architecture

```
FitSchedule/
├── README.md                           # Master project documentation
├── backend/                            # Spring Boot REST API
│   ├── mvnw.cmd / mvnw                 # Maven wrapper scripts
│   ├── pom.xml                         # Maven dependencies & build config
│   └── src/main/
│       ├── java/com/FitSchedule/backend/
│       │   ├── config/                 # CORS & DataInitializer seed data
│       │   ├── controller/             # REST controllers (Auth, Workout, Exercise, Trainer)
│       │   ├── dto/                    # Request/Response Data Transfer Objects
│       │   ├── entity/                 # JPA Entities (User, WorkoutPlan, Exercise, Trainer, etc.)
│       │   ├── exception/              # GlobalExceptionHandler
│       │   ├── repository/             # Spring Data JPA repositories
│       │   └── service/                # Business logic & Workout generator rules
│       └── resources/
│           └── application.properties  # Database connection & server config
└── frontend/                           # React + Vite application
    ├── package.json                    # Frontend dependencies & scripts
    ├── vite.config.js                  # Vite configuration
    ├── index.html                      # HTML entry point
    └── src/
        ├── main.jsx                    # React root entry
        ├── App.jsx                     # Core state & tab routing
        ├── index.css                   # Global light theme styles & tokens
        ├── components/                 # Navbar, AuthModal
        ├── pages/                      # Home, Planner, MyWorkouts, Schedule,
        │                               # ExerciseDatabase, ContactTrainer, TrainerDashboard
        └── services/                   # api.js (REST client)
```

---

## 🗄 How to Access the Database

FitSchedule uses a MySQL relational database named `fitschedule`. Tables are managed automatically by Hibernate (`spring.jpa.hibernate.ddl-auto=update`), and initial exercises, trainers, and demo users are automatically seeded on application start.

### Database Connection Details

| Parameter | Default Value | Notes |
| :--- | :--- | :--- |
| **Host** | `localhost` | `127.0.0.1` |
| **Port** | `3306` | Standard MySQL port |
| **Database Name** | `fitschedule` | Auto-created or pre-configured |
| **Username** | `root` | Configured in `application.properties` |
| **Password** | `root` | Configured in `application.properties` |
| **JDBC URL** | `jdbc:mysql://localhost:3306/fitschedule` | Unicode / UTC timezone enabled |

> 💡 **Config Location**: If your local MySQL uses a different username or password, update:
> `backend/src/main/resources/application.properties` lines 4–6:
> ```properties
> spring.datasource.url=jdbc:mysql://localhost:3306/fitschedule?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
> spring.datasource.username=YOUR_USERNAME
> spring.datasource.password=YOUR_PASSWORD
> ```

---

### Method 1: MySQL Command Line (CLI)

1. Open your terminal or Command Prompt / PowerShell.
2. Log into the MySQL client:
   ```bash
   mysql -u root -p
   ```
   *(Enter your MySQL root password when prompted)*

3. Switch to the FitSchedule database:
   ```sql
   USE fitschedule;
   ```

4. View all created tables:
   ```sql
   SHOW TABLES;
   ```

5. View existing records:
   ```sql
   -- View all seeded exercises
   SELECT id, name, muscle_group, equipment, category FROM exercises;

   -- View certified trainers
   SELECT id, name, specialization, email, rating FROM trainers;

   -- View registered users
   SELECT id, full_name, email, role FROM users;

   -- View user-generated workout plans
   SELECT id, title, fitness_goal, workout_frequency, user_email FROM workout_plans;

   -- View trainer inquiries / messages
   SELECT id, full_name, email, trainer_name, status, message, submitted_at FROM trainer_inquiries;
   ```

---

### Method 2: MySQL Workbench or GUI Tools

You can use **MySQL Workbench**, **DBeaver**, **TablePlus**, or the **Database Client** extension in VS Code:

1. Launch **MySQL Workbench**.
2. Click **+** (New Connection):
   - **Connection Name**: `FitSchedule Local`
   - **Hostname**: `127.0.0.1`
   - **Port**: `3306`
   - **Username**: `root`
   - **Password**: Click *Store in Vault...* and enter `root` (or your MySQL password)
3. Click **Test Connection** to confirm connectivity, then click **OK**.
4. Double-click the connection to open the SQL editor.
5. In the left **Schemas** pane, expand `fitschedule` > `Tables`.
6. Right-click any table (e.g., `exercises`, `workout_plans`) and select **Select Rows - Limit 1000**.

---

### Database Schema & Tables

FitSchedule structures its data across 7 relational tables:

```
+-------------------------------------------------------------+
|                        fitschedule                          |
+-------------------------------------------------------------+
| 1. users                  - Registered members & trainers   |
| 2. trainers               - Certified trainer roster & bios |
| 3. exercises              - 38 seeded movements with cues   |
| 4. workout_plans          - Saved custom user workout plans |
| 5. workout_days           - Split days (Day 1: Push, etc.)  |
| 6. workout_day_exercises  - Junction of exercises per day   |
| 7. trainer_inquiries      - Direct messages to trainers     |
+-------------------------------------------------------------+
```

#### Entity Relationships:
- **`workout_plans`** `1 ─── N` **`workout_days`** (Cascade ALL, orphan removal)
- **`workout_days`** `1 ─── N` **`workout_day_exercises`** (Cascade ALL, orphan removal)
- **`workout_day_exercises`** `N ─── 1` **`exercises`**
- **`trainer_inquiries`** records inquiries submitted by members to specific trainers.

---

### Useful SQL Queries

Here are helpful queries for inspecting system data:

```sql
-- 1. Count exercises per muscle group
SELECT muscle_group, COUNT(*) AS total_exercises
FROM exercises
GROUP BY muscle_group;

-- 2. List all workout plans with their scheduled days
SELECT p.id, p.title, p.fitness_goal, p.workout_frequency, d.day_order, d.day_of_week, d.title AS day_title
FROM workout_plans p
JOIN workout_days d ON p.id = d.plan_id
ORDER BY p.id, d.day_order;

-- 3. Inspect a specific plan's full daily exercise schedule
SELECT d.title AS day_title, de.exercise_name, de.sets, de.reps, de.rest_seconds
FROM workout_days d
JOIN workout_day_exercises de ON d.id = de.day_id
ORDER BY d.plan_id, d.day_order, de.order_index;

-- 4. Check all messages submitted to personal trainers
SELECT id, full_name, email, trainer_name, status, message, submitted_at
FROM trainer_inquiries
ORDER BY submitted_at DESC;
```

---

## 💻 How to Run the Application

### Prerequisites
- **Java Development Kit (JDK)** 21 or higher installed.
- **Node.js** (v18 or higher) and npm installed.
- **MySQL 8.0** service running locally.

---

### 1. Backend Setup (Spring Boot)

1. Open PowerShell / Command Prompt and navigate to the `backend` folder:
   ```powershell
   cd backend
   ```

2. Verify MySQL is running and the database `fitschedule` exists:
   ```sql
   CREATE DATABASE IF NOT EXISTS fitschedule;
   ```

3. Start the Spring Boot server using the included Maven wrapper:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   *(On macOS/Linux use `./mvnw spring-boot:run`)*

4. The backend server will start on port `8080`.
   - Health check: [http://localhost:8080/api/exercises](http://localhost:8080/api/exercises)

---

### 2. Frontend Setup (React + Vite)

1. Open a second terminal window and navigate to the `frontend` folder:
   ```powershell
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```powershell
   npm.cmd install
   ```

3. Start the Vite development server:
   ```powershell
   npm.cmd run dev
   ```

4. Open your browser and navigate to:
   - **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Demo Credentials

FitSchedule includes pre-seeded demo accounts with 1-click login buttons in the **Login** modal:

| Role | Email | Password | Access / Capabilities |
| :--- | :--- | :--- | :--- |
| **Member** | `member@fitschedule.com` | `password123` | Generate routines, save workouts to account, manage plans, contact coaches. |
| **Trainer** | `trainer@fitschedule.com` | `trainer123` | Access **Trainer Portal** to review member messages, answer inquiries, and change status. |

*(You can also use the **Register** tab in the Login modal to create any new custom account.)*

---

## 📡 REST API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/login` – Authenticate user (Member or Trainer)
- `POST /api/auth/register` – Register a new account

### 🏋️ Workouts (`/api/workouts`)
- `POST /api/workouts/generate` – Rule-based routine generation without saving
- `GET /api/workouts` – Fetch all saved plans (optionally filtered by `?email=...`)
- `GET /api/workouts/{id}` – Fetch plan details with all days and exercises
- `POST /api/workouts` – Persist a new workout plan
- `PUT /api/workouts/{id}` – Update an existing plan
- `DELETE /api/workouts/{id}` – Delete a workout plan

### 📚 Exercise Database (`/api/exercises`)
- `GET /api/exercises` – Retrieve all 38 exercises
- `GET /api/exercises/muscle/{muscleGroup}` – Filter exercises by muscle group
- `GET /api/exercises/{id}` – Get individual exercise details

### 👨‍🏫 Trainers & Inquiries
- `GET /api/trainers` – Retrieve list of certified trainers
- `POST /api/trainers/contact` – Submit an inquiry to a trainer
- `GET /api/trainer-inquiries` – View all inquiries (Trainer Portal)
- `PUT /api/trainer-inquiries/{id}/status` – Update inquiry status (`SUBMITTED`, `REVIEWED`, `ANSWERED`)

---

## 🏆 Production Architecture Summary
- **Complete Full-Stack Integration**: React UI ↔ Spring Boot Controller ↔ Service Logic ↔ JPA Repositories ↔ MySQL.
- **Clean Architecture**: Follows MVC/layered design principles with clear separation of concerns (Entities, DTOs, Repositories, Services, Controllers).
- **Lightweight & High Performance**: Clean light theme with solid colors, zero UI framework bloat, fast Vite bundling, and relational JPA cascade management.
