export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'CR';

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  rollNumber: string;
  department: string;
  course: string;
  semester: number;
  section: string;
  admissionYear: number;
  batch: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
}

export interface TeacherProfile {
  id: string;
  name: string;
  avatar: string;
  facultyId: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  officeRoom: string;
  assignedSubjects: string[];
}

export interface ClassScheduleItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  room: string;
  startTime: string;
  endTime: string;
  status: 'live' | 'upcoming' | 'completed';
  timeNotice?: string; // e.g. "Starts in 35 min" or "Live Now"
  section: string;
  day: string;
}

export interface TopicItem {
  id: string;
  title: string;
  completed: boolean;
  subtopics?: string[];
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'notes' | 'ppt' | 'pyq' | 'video' | 'syllabus';
  format: string; // 'PDF', 'PPTX', 'Link', 'MP4'
  fileSize?: string;
  unitNumber: number;
  unitTitle: string;
  subjectId: string;
  subjectName: string;
  facultyName: string;
  uploadDate: string;
  downloadUrl?: string;
  bookmarked: boolean;
  completed: boolean;
  description?: string;
  // Specific for PYQs:
  year?: number;
  examType?: 'Mid-Sem' | 'End-Sem' | 'Remedial';
  frequentlyRepeated?: boolean;
  // Specific for Videos:
  channel?: string;
  duration?: string;
  videoUrl?: string;
  thumbnail?: string;
}

export interface SubjectModule {
  unitNumber: number;
  title: string;
  topics: TopicItem[];
  progress: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  facultyName: string;
  facultyId: string;
  department: string;
  semester: number;
  credits: number;
  progress: number;
  resourcesCount: number;
  schedule: string;
  color: string;
  modules: SubjectModule[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  submittedAt: string;
  fileName: string;
  fileSize: string;
  filePreviewText: string;
  marksAwarded?: number;
  feedback?: string;
  status: 'submitted' | 'evaluated' | 'needs_revision';
  evaluatedAt?: string;
  similarityScore?: number;
  similarityMatchedWith?: string;
  similarityNote?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  facultyName: string;
  section: string;
  deadline: string; // ISO or friendly string
  deadlineFormatted: string;
  totalMarks: number;
  allowLate: boolean;
  instructions: string;
  attachmentName?: string;
  status: 'pending' | 'submitted' | 'evaluated' | 'late';
  submission?: AssignmentSubmission;
  // For teacher view:
  totalStudents: number;
  submittedCount: number;
  evaluatedCount: number;
  pendingCount: number;
}

export interface SubjectAttendance {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  attended: number;
  conducted: number;
  percentage: number;
  warningAlert?: boolean;
}

export interface BiometricLog {
  id: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'Present' | 'Late' | 'Absent';
}

export interface SemesterResult {
  semester: number;
  sgpa: number;
  cgpa: number;
  totalCredits: number;
  subjects: {
    code: string;
    name: string;
    grade: string;
    gradePoint: number;
    credits: number;
  }[];
}

export interface ExamForm {
  id: string;
  formNumber: string;
  examName: string;
  semester: number;
  submissionDate: string;
  status: 'Draft' | 'Submitted' | 'Verified' | 'Payment Pending' | 'Completed';
  selectedSubjects: string[];
  examFee: number;
  paymentStatus: 'Paid' | 'Pending';
  verificationAuthority: string;
}

export interface NoDuesItem {
  id: string;
  department: string;
  icon: string;
  status: 'Cleared' | 'Pending';
  clearedBy?: string;
  clearedDate?: string;
  remarks: string;
  amountDue?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  targetAudience: string;
  date: string;
  isUrgent: boolean;
  category: 'Exam' | 'Academic' | 'Class Update' | 'Event' | 'Administration';
  subjectName?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'assignment' | 'exam' | 'announcement' | 'notes' | 'admin';
  timestamp: string;
  read: boolean;
  actionType?: 'open_assignment' | 'open_subject' | 'open_announcement' | 'open_report';
  targetId?: string;
}

export interface ExamScheduleItem {
  id: string;
  examName: string;
  subjectCode: string;
  subjectName: string;
  date: string;
  time: string;
  room: string;
  remainingDays: number;
  instructions: string[];
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  sourceReference?: string;
}

export interface TeacherClass {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  semester: number;
  section: string;
  studentCount: number;
  classRoom: string;
  scheduleTime: string;
  averageAttendance: number;
  averageMarks: number;
  pendingEvaluations: number;
}
