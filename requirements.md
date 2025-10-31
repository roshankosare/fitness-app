# 🏋️ Fitness Web App — Requirements (v1.2)

## 📘 Overview

A minimalist fitness web application where users can select structured, week-wise workout plans and track their daily progress.
Admins can create, edit, and delete workout plans divided into weekly activities.

---

## 👤 User Roles

### 1. End User (`USER`)

Regular users who register, choose fitness plans, and log workouts.

#### ✅ Capabilities

* Register and log in.
* View all available workout plans.
* Select a plan to follow.
* View weekly activities for selected plans (Week 1, Week 2, etc.).
* Log daily workouts (sets, reps, duration, notes).
* Track progress and view workout history.
* Edit personal profile (age, height, weight, goal).

---

### 2. Admin (`ADMIN`)

Admins manage workout plans and curate weekly activities.

#### ✅ Capabilities

* Log in as admin.
* Create, edit, and delete workout plans.
* Add week-wise breakdown (e.g., Week 1–Week 4).
* Add JSON-based daily activity lists per week.
* Manage registered users (optional).
* View user participation and plan usage.

---

## 🧱 Database Models (Aligned with Prisma Schema)

### **User**

| Field     | Type                  | Description        |
| --------- | --------------------- | ------------------ |
| id        | String (UUID)         | Primary key        |
| email     | String (unique)       | User email         |
| fullName  | String                | User’s full name   |
| password  | String (hashed)       | Encrypted password |
| role      | Enum(`USER`, `ADMIN`) | Access level       |
| createdAt | DateTime              | Timestamp          |
| updatedAt | DateTime              | Timestamp          |

**Relations:**

* `UserProfile` (optional)
* `AdminProfile` (optional)
* `Workout[]` (for logged workouts)
* `UserPlan[]` (plans selected)
* `Plan[]` (if Admin — created plans)

---

### **UserProfile**

| Field     | Type     | Description                |
| --------- | -------- | -------------------------- |
| id        | String   | Primary key (UUID)         |
| userId    | String   | FK → User.id               |
| age       | Int?     | User age                   |
| heightCm  | Float?   | Height in centimeters      |
| weightKg  | Float?   | Weight in kilograms        |
| goal      | String?  | Fitness goal               |
| activity  | String?  | Activity level description |
| createdAt | DateTime | Auto timestamp             |
| updatedAt | DateTime | Auto timestamp             |

---

### **AdminProfile**

| Field     | Type     | Description        |
| --------- | -------- | ------------------ |
| id        | String   | Primary key (UUID) |
| userId    | String   | FK → User.id       |
| createdAt | DateTime | Auto timestamp     |
| updatedAt | DateTime | Auto timestamp     |

---

### **Plan**

| Field       | Type     | Description        |
| ----------- | -------- | ------------------ |
| id          | String   | Primary key (UUID) |
| name        | String   | Plan name          |
| description | String   | Short description  |
| createdById | String   | FK → Admin User.id |
| createdAt   | DateTime | Auto timestamp     |
| updatedAt   | DateTime | Auto timestamp     |

**Relations:**

* `PlanWeek[]` (weeks in this plan)
* `UserPlan[]` (users following this plan)
* `User (createdBy)` — the admin who created the plan

---

### **PlanWeek**

| Field      | Type     | Description                              |
| ---------- | -------- | ---------------------------------------- |
| id         | String   | Primary key (UUID)                       |
| planId     | String   | FK → Plan.id                             |
| weekNumber | Int      | Week number (e.g., 1, 2, 3...)           |
| activities | Json     | JSON object for Day 1–7 activity details |
| createdAt  | DateTime | Auto timestamp                           |
| updatedAt  | DateTime | Auto timestamp                           |

---

### **Workout**

| Field     | Type     | Description           |
| --------- | -------- | --------------------- |
| id        | String   | Primary key (UUID)    |
| userId    | String   | FK → User.id          |
| planId    | String   | FK → Plan.id          |
| exercise  | String   | Exercise name         |
| sets      | Int?     | Number of sets        |
| reps      | Int?     | Number of repetitions |
| duration  | Int?     | Duration (minutes)    |
| date      | DateTime | Workout date          |
| createdAt | DateTime | Auto timestamp        |
| updatedAt | DateTime | Auto timestamp        |

---

### **UserPlan** (Link table between User ↔ Plan)

| Field     | Type      | Description                       |
| --------- | --------- | --------------------------------- |
| id        | String    | Primary key (UUID)                |
| userId    | String    | FK → User.id                      |
| planId    | String    | FK → Plan.id                      |
| startDate | DateTime  | When user started this plan       |
| endDate   | DateTime? | Optional completion date          |
| progress  | Json?     | JSON for tracking week/day status |

🔸 **Constraint:** A user can select the same plan only once (`@@unique([userId, planId])`).

---

## 🔐 Access Control

| Feature                     | USER | ADMIN |
| --------------------------- | ---- | ----- |
| Register / Login            | ✅    | ✅     |
| View Plans                  | ✅    | ✅     |
| Select Plan                 | ✅    | ❌     |
| Log Workout                 | ✅    | ❌     |
| Create / Edit / Delete Plan | ❌    | ✅     |
| Add Week-wise Activities    | ❌    | ✅     |
| Manage Users (Optional)     | ❌    | ✅     |

---

## 🧰 Tech Stack

| Layer      | Technology               |
| ---------- | ------------------------ |
| Frontend   | React + Bootstrap        |
| Backend    | Express.js + TypeScript  |
| Database   | MySQL (via Prisma ORM)   |
| Auth       | JWT-based Authentication |
| Deployment | VPS / Dockerized setup   |

---

## 🚀 MVP Goals

1. **Authentication System**

   * Secure signup/login with JWT
   * Role-based access (User/Admin)
2. **Admin Management**

   * Create, edit, delete workout plans
   * Add week-wise activity data
3. **User Experience**

   * View and select available plans
   * Track weekly progress
   * Log daily workouts
4. **Optional Enhancements**

   * Progress visualization
   * Profile editing
   * Admin dashboard insights

---

**Version:** 1.2
**Author:** Roshan Kosare
**Date:** 2025-10-31
**Status:** ✅ Schema + Requirements Synced
