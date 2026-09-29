import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider, useApp } from './src/context/AppContext';
import { colors, borderRadius, shadows } from './src/theme';

// Student Screens
import { StudentHomeScreen } from './src/screens/student/StudentHomeScreen';
import { StudentAcademicScreen } from './src/screens/student/StudentAcademicScreen';
import { StudentReportsScreen } from './src/screens/student/StudentReportsScreen';
import { StudentProfileScreen } from './src/screens/student/StudentProfileScreen';

// Teacher Screens
import { TeacherDashboardScreen } from './src/screens/teacher/TeacherDashboardScreen';
import { TeacherClassesScreen } from './src/screens/teacher/TeacherClassesScreen';
import { TeacherResourcesScreen } from './src/screens/teacher/TeacherResourcesScreen';
import { TeacherAssignmentsScreen } from './src/screens/teacher/TeacherAssignmentsScreen';
import { TeacherProfileScreen } from './src/screens/teacher/TeacherProfileScreen';

// Global Modals
import { RoleSwitcherModal } from './src/components/common/RoleSwitcherModal';
import { NotificationModal } from './src/components/common/NotificationModal';
import { GlobalSearchModal } from './src/components/common/GlobalSearchModal';
import { AIAssistantModal } from './src/components/common/AIAssistantModal';
import { ResourceViewerModal } from './src/components/common/ResourceViewerModal';

// Auth Screen
import { AuthScreen } from './src/screens/auth/AuthScreen';

const MainNavigator: React.FC = () => {
  const { role, openAIAssistant, isAuthenticated } = useApp();

  // Student bottom tab indices: 0: Home, 1: Academic, 2: Reports, 3: Profile
  const [studentTabIndex, setStudentTabIndex] = useState(0);
  const [academicSubTab, setAcademicSubTab] = useState<string | undefined>(undefined);
  const [reportsSubTab, setReportsSubTab] = useState<string | undefined>(undefined);

  // Teacher bottom tab indices: 0: Dashboard, 1: Classes, 2: Resources, 3: Assignments, 4: Profile
  const [teacherTabIndex, setTeacherTabIndex] = useState(0);
  const [openCreateAsgModal, setOpenCreateAsgModal] = useState(false);

  const isStudent = role === 'STUDENT';

  // If user is not yet logged in, show the Auth / Login flow
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <AuthScreen />
      </SafeAreaView>
    );
  }

  // Navigate to student tab with optional sub tab parameters
  const handleStudentNavigate = (tabIndex: number, params?: any) => {
    setStudentTabIndex(tabIndex);
    if (tabIndex === 1 && params?.subTab) {
      setAcademicSubTab(params.subTab);
    }
    if (tabIndex === 2 && params?.subTab) {
      setReportsSubTab(params.subTab);
    }
  };

  // Navigate to teacher tab with optional parameters
  const handleTeacherNavigate = (tabIndex: number, params?: any) => {
    setTeacherTabIndex(tabIndex);
    if (tabIndex === 3 && params?.openCreateModal) {
      setOpenCreateAsgModal(true);
    }
  };

  // Student Bottom Tab Bar Config (Section 2)
  const studentTabs = [
    { label: 'Home', icon: 'home' as const, outlineIcon: 'home-outline' as const },
    { label: 'Academic', icon: 'book' as const, outlineIcon: 'book-outline' as const },
    { label: 'Reports', icon: 'stats-chart' as const, outlineIcon: 'stats-chart-outline' as const },
    { label: 'Profile', icon: 'person' as const, outlineIcon: 'person-outline' as const },
  ];

  // Teacher Bottom Tab Bar Config (Section 31)
  const teacherTabs = [
    { label: 'Dashboard', icon: 'grid' as const, outlineIcon: 'grid-outline' as const },
    { label: 'Classes', icon: 'school' as const, outlineIcon: 'school-outline' as const },
    { label: 'Resources', icon: 'folder' as const, outlineIcon: 'folder-outline' as const },
    { label: 'Assignments', icon: 'clipboard' as const, outlineIcon: 'clipboard-outline' as const },
    { label: 'Profile', icon: 'person' as const, outlineIcon: 'person-outline' as const },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Main Screen Content */}
      <View style={styles.screenContainer}>
        {isStudent ? (
          <>
            {studentTabIndex === 0 && <StudentHomeScreen onNavigateToTab={handleStudentNavigate} />}
            {studentTabIndex === 1 && <StudentAcademicScreen initialSubTab={academicSubTab} />}
            {studentTabIndex === 2 && <StudentReportsScreen initialSubTab={reportsSubTab} />}
            {studentTabIndex === 3 && <StudentProfileScreen />}
          </>
        ) : (
          <>
            {teacherTabIndex === 0 && <TeacherDashboardScreen onNavigateToTab={handleTeacherNavigate} />}
            {teacherTabIndex === 1 && <TeacherClassesScreen />}
            {teacherTabIndex === 2 && <TeacherResourcesScreen />}
            {teacherTabIndex === 3 && <TeacherAssignmentsScreen initialOpenCreate={openCreateAsgModal} />}
            {teacherTabIndex === 4 && <TeacherProfileScreen />}
          </>
        )}
      </View>

      {/* Floating "Ask AI" button on Student screens (Section 18) */}
      {isStudent && (
        <TouchableOpacity
          style={styles.floatingAIButton}
          onPress={openAIAssistant}
          activeOpacity={0.85}
        >
          <Ionicons name="sparkles" size={17} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.floatingAIText}>Ask AI</Text>
        </TouchableOpacity>
      )}

      {/* Primary Bottom Navigation Bar (Section 2 & 31) */}
      <View style={styles.bottomTabBar}>
        {isStudent
          ? studentTabs.map((tab, idx) => {
              const isActive = studentTabIndex === idx;
              return (
                <TouchableOpacity
                  key={tab.label}
                  style={styles.tabButton}
                  onPress={() => {
                    setStudentTabIndex(idx);
                    setAcademicSubTab(undefined);
                    setReportsSubTab(undefined);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isActive ? tab.icon : tab.outlineIcon}
                    size={22}
                    color={isActive ? colors.primary : colors.textMuted}
                  />
                  <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                    {tab.label}
                  </Text>
                  {isActive && <View style={styles.activeTabIndicator} />}
                </TouchableOpacity>
              );
            })
          : teacherTabs.map((tab, idx) => {
              const isActive = teacherTabIndex === idx;
              return (
                <TouchableOpacity
                  key={tab.label}
                  style={styles.tabButton}
                  onPress={() => {
                    setTeacherTabIndex(idx);
                    setOpenCreateAsgModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isActive ? tab.icon : tab.outlineIcon}
                    size={22}
                    color={isActive ? colors.primary : colors.textMuted}
                  />
                  <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                    {tab.label}
                  </Text>
                  {isActive && <View style={styles.activeTabIndicator} />}
                </TouchableOpacity>
              );
            })}
      </View>

      {/* Global Modals Mounted */}
      <RoleSwitcherModal />
      <NotificationModal />
      <GlobalSearchModal />
      <AIAssistantModal />
      <ResourceViewerModal />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  floatingAIButton: {
    position: 'absolute',
    right: 18,
    bottom: 74,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: '#FFFFFF40',
    ...shadows.float,
    zIndex: 99,
  },
  floatingAIText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    paddingHorizontal: 8,
    ...shadows.card,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 3,
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
  activeTabIndicator: {
    position: 'absolute',
    top: -6,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});
