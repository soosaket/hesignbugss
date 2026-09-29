import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserRole,
  StudentProfile,
  TeacherProfile,
  ClassScheduleItem,
  Subject,
  Assignment,
  AssignmentSubmission,
  SubjectAttendance,
  BiometricLog,
  SemesterResult,
  ExamForm,
  NoDuesItem,
  Announcement,
  NotificationItem,
  ExamScheduleItem,
  ResourceItem,
  TeacherClass,
} from '../types';
import {
  mockStudentProfile,
  mockTeacherProfile,
  mockTodayClasses,
  mockSubjects,
  mockAssignments,
  mockSubmissionsForTeacher,
  mockAnnouncements,
  mockNotifications,
  mockAttendance,
  mockBiometricToday,
  mockBiometricHistory,
  mockSemesterResults,
  mockExamForm,
  mockNoDuesList,
  mockUpcomingExams,
  mockResources,
  mockTeacherClasses,
  mockClassRoster,
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  student: StudentProfile;
  teacher: TeacherProfile;
  todayClasses: ClassScheduleItem[];
  subjects: Subject[];
  assignments: Assignment[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  attendance: SubjectAttendance[];
  biometricToday: BiometricLog;
  biometricHistory: BiometricLog[];
  results: SemesterResult[];
  examForm: ExamForm;
  noDues: NoDuesItem[];
  upcomingExams: ExamScheduleItem[];
  resources: ResourceItem[];
  teacherClasses: TeacherClass[];
  teacherSubmissions: { [assignmentId: string]: AssignmentSubmission[] };
  classRoster: typeof mockClassRoster;

  // Student Actions
  submitAssignment: (assignmentId: string, fileName: string, filePreview: string) => void;
  toggleTopicCompletion: (subjectId: string, unitNumber: number, topicId: string) => void;
  toggleBookmark: (resourceId: string) => void;
  toggleResourceCompleted: (resourceId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;

  // Teacher Actions
  createAssignment: (newAsg: Omit<Assignment, 'id' | 'status' | 'totalStudents' | 'submittedCount' | 'evaluatedCount' | 'pendingCount'>) => void;
  evaluateSubmission: (assignmentId: string, submissionId: string, marks: number, feedback: string) => void;
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  uploadResource: (resource: Omit<ResourceItem, 'id' | 'uploadDate' | 'bookmarked' | 'completed'>) => void;
  toggleStudentAttendance: (studentId: string) => void;

  // UI Modals State
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  isNotificationsOpen: boolean;
  openNotifications: () => void;
  closeNotifications: () => void;
  isAIAssistantOpen: boolean;
  openAIAssistant: () => void;
  closeAIAssistant: () => void;
  isRoleSwitcherOpen: boolean;
  openRoleSwitcher: () => void;
  closeRoleSwitcher: () => void;
  // Auth State & Actions
  isAuthenticated: boolean;
  login: (identifier: string, password: string, selectedRole?: UserRole) => boolean;
  signup: (data: {
    fullName: string;
    regNo: string;
    session: string;
    branch: string;
    phone: string;
    email: string;
    password: string;
    role: UserRole;
  }) => boolean;
  logout: () => void;

  selectedResourceForView: ResourceItem | null;
  openResourceViewer: (resource: ResourceItem) => void;
  closeResourceViewer: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH: '@gecm_auth',
  ROLE: '@gecm_role',
  ASSIGNMENTS: '@gecm_assignments',
  NOTIFICATIONS: '@gecm_notifications',
  SUBJECTS: '@gecm_subjects',
  RESOURCES: '@gecm_resources',
  ANNOUNCEMENTS: '@gecm_announcements',
  TEACHER_SUBMISSIONS: '@gecm_teacher_submissions',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRoleState] = useState<UserRole>('STUDENT');
  const [student, setStudent] = useState<StudentProfile>(mockStudentProfile);
  const [teacher, setTeacher] = useState<TeacherProfile>(mockTeacherProfile);
  const [todayClasses] = useState<ClassScheduleItem[]>(mockTodayClasses);
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [attendance] = useState<SubjectAttendance[]>(mockAttendance);
  const [biometricToday] = useState<BiometricLog>(mockBiometricToday);
  const [biometricHistory] = useState<BiometricLog[]>(mockBiometricHistory);
  const [results] = useState<SemesterResult[]>(mockSemesterResults);
  const [examForm] = useState<ExamForm>(mockExamForm);
  const [noDues] = useState<NoDuesItem[]>(mockNoDuesList);
  const [upcomingExams] = useState<ExamScheduleItem[]>(mockUpcomingExams);
  const [resources, setResources] = useState<ResourceItem[]>(mockResources);
  const [teacherClasses] = useState<TeacherClass[]>(mockTeacherClasses);
  const [teacherSubmissions, setTeacherSubmissions] = useState(mockSubmissionsForTeacher);
  const [classRoster, setClassRoster] = useState(mockClassRoster);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [selectedResourceForView, setSelectedResourceForView] = useState<ResourceItem | null>(null);

  // Load persisted role and auth if any
  useEffect(() => {
    (async () => {
      try {
        const [savedRole, savedAuth] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.ROLE),
          AsyncStorage.getItem(STORAGE_KEYS.AUTH),
        ]);
        if (savedRole === 'STUDENT' || savedRole === 'TEACHER') {
          setRoleState(savedRole);
        }
        if (savedAuth === 'true') {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.log('Error loading saved state:', e);
      }
    })();
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    AsyncStorage.setItem(STORAGE_KEYS.ROLE, newRole).catch(() => {});
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markNotificationRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleTopicCompletion = (subjectId: string, unitNumber: number, topicId: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const updatedModules = sub.modules.map((mod) => {
          if (mod.unitNumber !== unitNumber) return mod;
          const updatedTopics = mod.topics.map((t) =>
            t.id === topicId ? { ...t, completed: !t.completed } : t
          );
          const completedCount = updatedTopics.filter((t) => t.completed).length;
          const moduleProgress = Math.round((completedCount / updatedTopics.length) * 100);
          return {
            ...mod,
            topics: updatedTopics,
            progress: moduleProgress,
          };
        });

        // Recalculate subject overall progress
        const totalProgress = Math.round(
          updatedModules.reduce((acc, m) => acc + m.progress, 0) / updatedModules.length
        );

        return {
          ...sub,
          modules: updatedModules,
          progress: totalProgress,
        };
      })
    );
  };

  const toggleBookmark = (resourceId: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === resourceId ? { ...r, bookmarked: !r.bookmarked } : r))
    );
  };

  const toggleResourceCompleted = (resourceId: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === resourceId ? { ...r, completed: !r.completed } : r))
    );
  };

  const submitAssignment = (assignmentId: string, fileName: string, filePreview: string) => {
    const submissionId = `sub_${Date.now()}`;
    const newSubmission: AssignmentSubmission = {
      id: submissionId,
      assignmentId,
      studentId: student.id,
      studentName: student.name,
      studentRoll: student.rollNumber,
      submittedAt: 'Just now',
      fileName,
      fileSize: '3.4 MB',
      filePreviewText: filePreview,
      status: 'submitted',
      similarityScore: 87, // Demonstrating similarity detection for demo assignment
      similarityMatchedWith: 'Aman Verma (24CSE018)',
      similarityNote: 'Code structure overlap detected for verification.',
    };

    // Update assignment in student view
    setAssignments((prev) =>
      prev.map((asg) =>
        asg.id === assignmentId
          ? {
              ...asg,
              status: 'submitted',
              submission: newSubmission,
              submittedCount: asg.submittedCount + 1,
              pendingCount: Math.max(0, asg.pendingCount - 1),
            }
          : asg
      )
    );

    // Update teacher submissions list
    setTeacherSubmissions((prev) => {
      const existing = prev[assignmentId] || [];
      return {
        ...prev,
        [assignmentId]: [newSubmission, ...existing.filter((s) => s.studentId !== student.id)],
      };
    });

    // Notify
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Assignment Submitted Successfully',
      message: `Your file "${fileName}" has been handed in to the instructor.`,
      category: 'assignment',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const evaluateSubmission = (
    assignmentId: string,
    submissionId: string,
    marks: number,
    feedback: string
  ) => {
    // Update teacher submissions
    setTeacherSubmissions((prev) => {
      const list = prev[assignmentId] || [];
      return {
        ...prev,
        [assignmentId]: list.map((sub) =>
          sub.id === submissionId
            ? {
                ...sub,
                marksAwarded: marks,
                feedback,
                status: 'evaluated',
                evaluatedAt: 'Just now',
              }
            : sub
        ),
      };
    });

    // Update assignment counts and student assignment view
    setAssignments((prev) =>
      prev.map((asg) => {
        if (asg.id !== assignmentId) return asg;
        const isCurrentStudentSubmission = asg.submission?.id === submissionId;
        return {
          ...asg,
          evaluatedCount: asg.evaluatedCount + 1,
          status: isCurrentStudentSubmission ? 'evaluated' : asg.status,
          submission: isCurrentStudentSubmission
            ? {
                ...asg.submission!,
                marksAwarded: marks,
                feedback,
                status: 'evaluated',
                evaluatedAt: 'Just now',
              }
            : asg.submission,
        };
      })
    );

    // Notify student
    const notif: NotificationItem = {
      id: `notif_grade_${Date.now()}`,
      title: 'Assignment Evaluated & Graded',
      message: `Your instructor graded your submission: ${marks} marks. Feedback: "${feedback}"`,
      category: 'assignment',
      timestamp: 'Just now',
      read: false,
      targetId: assignmentId,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const createAssignment = (
    newAsgData: Omit<
      Assignment,
      'id' | 'status' | 'totalStudents' | 'submittedCount' | 'evaluatedCount' | 'pendingCount'
    >
  ) => {
    const newId = `asg_${Date.now()}`;
    const newAsg: Assignment = {
      ...newAsgData,
      id: newId,
      status: 'pending',
      totalStudents: 42,
      submittedCount: 0,
      evaluatedCount: 0,
      pendingCount: 42,
    };

    setAssignments((prev) => [newAsg, ...prev]);

    // Broadcast notification
    const broadcast: NotificationItem = {
      id: `notif_new_asg_${Date.now()}`,
      title: `New Assignment: ${newAsg.title}`,
      message: `Deadline: ${newAsg.deadlineFormatted} (${newAsg.totalMarks} Marks)`,
      category: 'assignment',
      timestamp: 'Just now',
      read: false,
      actionType: 'open_assignment',
      targetId: newId,
    };
    setNotifications((prev) => [broadcast, ...prev]);
  };

  const createAnnouncement = (annData: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...annData,
      id: `anc_${Date.now()}`,
      date: 'Just now',
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    const notif: NotificationItem = {
      id: `notif_anc_${Date.now()}`,
      title: `Announcement: ${newAnn.title}`,
      message: newAnn.content.slice(0, 80) + '...',
      category: 'announcement',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const uploadResource = (
    resData: Omit<ResourceItem, 'id' | 'uploadDate' | 'bookmarked' | 'completed'>
  ) => {
    const newResource: ResourceItem = {
      ...resData,
      id: `res_${Date.now()}`,
      uploadDate: 'Today',
      bookmarked: false,
      completed: false,
    };

    setResources((prev) => [newResource, ...prev]);

    // Update subject resource count
    setSubjects((prev) =>
      prev.map((sub) =>
        sub.id === newResource.subjectId
          ? { ...sub, resourcesCount: sub.resourcesCount + 1 }
          : sub
      )
    );

    const notif: NotificationItem = {
      id: `notif_res_${Date.now()}`,
      title: `New ${newResource.type.toUpperCase()}: ${newResource.title}`,
      message: `Uploaded for ${newResource.subjectName} (Unit ${newResource.unitNumber})`,
      category: 'notes',
      timestamp: 'Just now',
      read: false,
      actionType: 'open_subject',
      targetId: newResource.subjectId,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const toggleStudentAttendance = (studentId: string) => {
    setClassRoster((prev) =>
      prev.map((st) => (st.id === studentId ? { ...st, presentToday: !st.presentToday } : st))
    );
  };

  const login = (_identifier: string, _password: string, selectedRole?: UserRole) => {
    if (selectedRole) {
      setRole(selectedRole);
    }
    setIsAuthenticated(true);
    AsyncStorage.setItem(STORAGE_KEYS.AUTH, 'true').catch(() => {});
    return true;
  };

  const signup = (data: {
    fullName: string;
    regNo: string;
    session: string;
    branch: string;
    phone: string;
    email: string;
    password: string;
    role: UserRole;
  }) => {
    setRole(data.role);
    if (data.role === 'STUDENT') {
      setStudent((prev) => ({
        ...prev,
        name: data.fullName || prev.name,
        rollNumber: data.regNo || prev.rollNumber,
        department: data.branch || prev.department,
        batch: data.session || prev.batch,
        phone: data.phone || prev.phone,
        email: data.email || prev.email,
      }));
    } else {
      setTeacher((prev) => ({
        ...prev,
        name: data.fullName || prev.name,
        facultyId: data.regNo || prev.facultyId,
        department: data.branch || prev.department,
        phone: data.phone || prev.phone,
        email: data.email || prev.email,
      }));
    }
    setIsAuthenticated(true);
    AsyncStorage.setItem(STORAGE_KEYS.AUTH, 'true').catch(() => {});
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    AsyncStorage.removeItem(STORAGE_KEYS.AUTH).catch(() => {});
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        student,
        teacher,
        todayClasses,
        subjects,
        assignments,
        announcements,
        notifications,
        unreadNotificationCount,
        attendance,
        biometricToday,
        biometricHistory,
        results,
        examForm,
        noDues,
        upcomingExams,
        resources,
        teacherClasses,
        teacherSubmissions,
        classRoster,

        // Student actions
        submitAssignment,
        toggleTopicCompletion,
        toggleBookmark,
        toggleResourceCompleted,
        markNotificationRead,
        markAllNotificationsRead,

        // Teacher actions
        createAssignment,
        evaluateSubmission,
        createAnnouncement,
        uploadResource,
        toggleStudentAttendance,

        // UI Modals
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
        isNotificationsOpen,
        openNotifications: () => setIsNotificationsOpen(true),
        closeNotifications: () => setIsNotificationsOpen(false),
        isAIAssistantOpen,
        openAIAssistant: () => setIsAIAssistantOpen(true),
        closeAIAssistant: () => setIsAIAssistantOpen(false),
        isRoleSwitcherOpen,
        openRoleSwitcher: () => setIsRoleSwitcherOpen(true),
        closeRoleSwitcher: () => setIsRoleSwitcherOpen(false),
        selectedResourceForView,
        openResourceViewer: (r) => setSelectedResourceForView(r),
        closeResourceViewer: () => setSelectedResourceForView(null),

        // Auth
        isAuthenticated,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
