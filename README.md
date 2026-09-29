# GECM College Learning Management System (LMS) Mobile App

A modern, clean, mobile-first academic companion app built with **Expo (React Native)** and **TypeScript**, specifically designed for real-time testing on **Expo Go** and ready for **Firebase** backend integration.

---

## 🌟 Key Features

### 1. Dual Role-Based Experiences (Instant Switcher)
Seamlessly switch between **Student** and **Faculty** experiences at any time via the header pill or the Profile tab. Built on an extensible **RBAC architecture** ready to incorporate future Administrator and Class Representative (CR) roles.

### 2. Student Panel
- **Home Dashboard**:
  - **Student Header**: Greeting, profile avatar, semester, section, notification bell with unread counter.
  - **"Your Priorities"**: Smart priority highlight for top academic tasks.
  - **Today's Classes**: Real-time status cards (*"Live Now"*, *"Starts in 35 min"*), faculty name, room location.
  - **Assignment Summary**: Filter by *Pending*, *Due Soon*, and *Submitted* with interactive `[Submit Now]` solution upload modal.
  - **Academic Quick Access**: 1-tap navigation to Syllabus, Notes, PYQs, Assignments, Exams, Attendance, and Results.
  - **Announcements**: College and department circulars with urgency tags.
  - **Upcoming Deadlines**: Chronological timeline countdown for tests and submissions.
- **Academic Resource Center**:
  - **Course Hierarchy**: Department › Semester › Subject › Unit/Module › Resources.
  - **Subject Detail**: Overview, credits, lecture timetable, progress gauge, modules 1 through 5.
  - **Interactive Syllabus**: Expandable units with real-time topic checkboxes and automatic syllabus progress percentage recalculation.
  - **Notes & PPTs**: Searchable catalog with document preview, download simulator, and bookmarking.
  - **PYQ Repository**: Previous Year Question papers categorized by year (2025, 2024, 2023, 2022) with *"★ Repeated Questions"* badges.
  - **Suggested YouTube Lectures**: Curated video lessons with channel info, duration, and embedded player preview.
  - **Exams Timetable**: Mid-sem and end-sem schedules with instructions and countdown timers.
  - **My Bookmarks**: Dedicated tab to access saved notes, PYQs, and videos.
- **Reports Dashboard**:
  - **Classroom Attendance**: Subject-wise attended/conducted statistics and percentage.
  - **Attendance Warning Alert**: Automatic informational alert for subjects below 75% requirement.
  - **Biometric Campus Attendance**: Daily check-in/check-out status and recent swipe history.
  - **Official Results**: Semester-wise marksheet with SGPA, CGPA, and letter grades.
  - **Examination Registration**: Verification status, registered subjects, and payment receipt.
  - **Digital No-Dues Clearance**: Department-by-department clearance status and overall completion gauge.
  - **Academic Performance Health**: Consolidated indicator cards.
- **Profile & ID**:
  - Digital Student ID card with barcode.
  - Enrollment details (Roll number, Department, Admission year, Batch).
  - Account preferences, change password modal, notification toggles, and logout.
- **Academic AI Study Assistant ("Ask AI")**:
  - Discreet floating button that opens an AI companion grounded in the college curriculum.
  - Quick chips: *"Explain Unit 2 in simple language"*, *"Summarize this PDF"*, *"Generate 10 MCQs"*, *"Create 7-day study plan"*.
- **Global Search**:
  - Instant search across subjects, notes, PPTs, PYQs, assignments, faculty, and notices.
- **Notification Center**:
  - Filter notifications by category (*Assignments*, *Notes*, *Exams*, *Announcements*) and mark all as read.

---

### 3. Faculty / Teacher Panel
- **Teacher Dashboard**:
  - Daily greeting, summary metrics (*Today's Classes: 3*, *Pending Reviews: 18*, *Active Tasks: 4*).
  - Quick action buttons: `[Upload Resource]`, `[Create Assignment]`, `[Evaluate Submissions]`, `[Post Notice]`.
  - Today's teaching schedule with live class tags.
  - Pending submission review alerts.
- **Classroom & Roster Management**:
  - Assigned subjects and classes.
  - Interactive student roster with 1-tap **Present / Absent** toggle for every student and save to ERP.
- **Resource Management (Strict Categorization)**:
  - Faculty upload modal requiring: **Department › Semester › Subject › Unit › Resource Type**.
  - Newly uploaded materials immediately publish to student academic feeds.
- **Assignment & Evaluation Management**:
  - Create new assignments with title, marks, deadline, instructions, and late-submission permissions.
  - Submissions list showing student names, file attachments, and submission timestamps.
  - Interactive grading modal: enter marks and written faculty feedback.
- **AI Similarity Detection**:
  - Flags high structural overlap between student submissions (e.g. 87% match between Student A and Student B).
  - Side-by-side code diff viewer for faculty review without automated accusation.
- **Faculty Profile**:
  - Designation, Faculty ID, assigned courses, office hours availability switch, and logout.

---

## 🚀 How to Run the App on Expo Go

### Prerequisites
Make sure you have Node.js (v18+) installed.

### 1. Start the Expo Development Server
Run the following command in the project root:

```bash
npx expo start
```

### 2. Test in Expo Go (Mobile Device)
1. Install the **Expo Go** app from the Google Play Store (Android) or Apple App Store (iOS).
2. Ensure your mobile device and computer are on the **same Wi-Fi network**.
3. Scan the QR code displayed in the terminal:
   - On Android: Scan directly inside the **Expo Go** app.
   - On iOS: Scan with the default **Camera** app and tap the Expo banner.

### 3. Test on Web (Browser)
Press `w` in the terminal or run:
```bash
npm run web
```

---

## 🔧 Backend & Firebase Integration

The application is structured with a modular service layer located at `src/services/firebaseConfig.ts`.

### Running in Prototype Mode (Default)
Out of the box, the app runs on a persistent local storage engine with realistic seed data. All actions (submitting assignments, grading, uploading resources, toggling bookmarks, modifying attendance) persist between reloads using `@react-native-async-storage/async-storage`.

### Connecting Your Real Firebase Project:
1. Install the Firebase SDK:
   ```bash
   npx expo install firebase
   ```
2. Open `src/services/firebaseConfig.ts`.
3. Paste your credentials from the **Firebase Console** (Project Settings › General › Your apps):
   ```typescript
   export const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };

   export const USE_REAL_FIREBASE = true;
   ```

---

## 📁 Project File Structure

```
├── App.tsx                          # Root Navigator with Role-based Tab Bar & Modals
├── app.json                         # Expo configuration
├── package.json                     # Dependencies (SDK 57)
├── tsconfig.json                    # Strict TypeScript configuration
└── src/
    ├── types/                       # Data models & interfaces
    │   └── index.ts
    ├── theme/                       # Modern academic design system tokens
    │   └── index.ts
    ├── data/                        # Seed mock database
    │   └── mockData.ts
    ├── context/                     # Reactive state provider & action handlers
    │   └── AppContext.tsx
    ├── services/                    # Firebase bridge & offline engine
    │   └── firebaseConfig.ts
    ├── components/common/           # Reusable UI components & modals
    │   ├── Header.tsx               # Adaptive header with greeting & role switcher
    │   ├── Card.tsx                 # Rounded card with shadows
    │   ├── Badge.tsx                # Status badges (Live, Pending, Graded, Warning)
    │   ├── ProgressBar.tsx          # Animated progress bar
    │   ├── EmptyState.tsx           # Friendly empty state illustrations
    │   ├── RoleSwitcherModal.tsx    # Instant Student <-> Faculty toggle
    │   ├── NotificationModal.tsx    # Categorized notification center
    │   ├── GlobalSearchModal.tsx    # Multi-entity search modal
    │   ├── AIAssistantModal.tsx     # Curriculum-grounded AI Study Assistant
    │   └── ResourceViewerModal.tsx  # Note/PPT/PYQ document reader simulation
    └── screens/
        ├── student/
        │   ├── StudentHomeScreen.tsx      # Daily command center
        │   ├── StudentAcademicScreen.tsx  # Subjects, Syllabus, Notes, PYQs, Videos
        │   ├── StudentReportsScreen.tsx   # Attendance, Results, Exam Form, No-Dues
        │   └── StudentProfileScreen.tsx   # Student ID, account, credentials
        └── teacher/
            ├── TeacherDashboardScreen.tsx   # Faculty dashboard & announcements
            ├── TeacherClassesScreen.tsx     # Class roster & lecture attendance
            ├── TeacherResourcesScreen.tsx   # Categorized resource uploader
            ├── TeacherAssignmentsScreen.tsx # Assignment creator, grading, AI similarity
            └── TeacherProfileScreen.tsx     # Faculty credentials & office hours
```

---

## 🧪 Quality Assurance & Diagnostics

The project passes all Expo and TypeScript checks:
- **TypeScript**: `npx tsc --noEmit` — 0 errors.
- **Expo Doctor**: `npx expo-doctor` — 21/21 checks passed.
- **ESLint**: `npx expo lint` — 0 errors, 0 warnings.
- **Metro Bundler**: Tested and exported cleanly for web and mobile.
