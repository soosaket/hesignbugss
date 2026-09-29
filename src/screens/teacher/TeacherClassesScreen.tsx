import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius } from '../../theme';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { TeacherClass } from '../../types';

export const TeacherClassesScreen: React.FC = () => {
  const { teacherClasses, classRoster, toggleStudentAttendance } = useApp();
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);

  const presentCount = classRoster.filter((s) => s.presentToday).length;

  const handleSaveAttendance = () => {
    Alert.alert(
      'Attendance Recorded ✓',
      `Class attendance has been recorded to GECM Academic ERP: ${presentCount} Present, ${classRoster.length - presentCount} Absent.`
    );
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {selectedClass ? (
          /* Class Roster & Management Detail View */
          <View>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setSelectedClass(null)}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={18} color={colors.primary} />
              <Text style={styles.backBtnText}>All Assigned Classes</Text>
            </TouchableOpacity>

            <Card style={styles.selectedClassCard} highlightBorder={colors.primary}>
              <View style={styles.classCardHeader}>
                <View>
                  <Text style={styles.classCode}>{selectedClass.subjectCode}</Text>
                  <Text style={styles.className}>{selectedClass.subjectName}</Text>
                  <Text style={styles.classSub}>
                    Semester {selectedClass.semester} • {selectedClass.section} • {selectedClass.classRoom}
                  </Text>
                </View>
                <Badge label={`${selectedClass.studentCount} Students`} variant="primary" size="md" />
              </View>

              <View style={styles.classMetricsGrid}>
                <View style={styles.classMetricItem}>
                  <Text style={styles.classMetricValue}>{selectedClass.averageAttendance}%</Text>
                  <Text style={styles.classMetricLabel}>Avg Attendance</Text>
                </View>
                <View style={styles.classMetricItem}>
                  <Text style={styles.classMetricValue}>{selectedClass.averageMarks}%</Text>
                  <Text style={styles.classMetricLabel}>Class Average</Text>
                </View>
                <View style={styles.classMetricItem}>
                  <Text style={[styles.classMetricValue, { color: colors.warningText }]}>
                    {selectedClass.pendingEvaluations}
                  </Text>
                  <Text style={styles.classMetricLabel}>Pending Reviews</Text>
                </View>
              </View>
            </Card>

            {/* Attendance Marker Console */}
            <View style={styles.rosterSectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>{"Today's Lecture Attendance"}</Text>
                <Text style={styles.sectionSubtitle}>
                  {presentCount} Present • {classRoster.length - presentCount} Absent
                </Text>
              </View>
              <TouchableOpacity
                style={styles.saveAttendanceBtn}
                onPress={handleSaveAttendance}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-done" size={15} color="#FFF" style={{ marginRight: 4 }} />
                <Text style={styles.saveAttendanceBtnText}>Save</Text>
              </TouchableOpacity>
            </View>

            <Card style={styles.rosterCard}>
              {classRoster.map((student, idx) => (
                <View
                  key={student.id}
                  style={[
                    styles.rosterRow,
                    idx !== classRoster.length - 1 && styles.rosterRowBorder,
                  ]}
                >
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentNameText}>{student.name}</Text>
                    <Text style={styles.studentRollText}>
                      {student.roll} • Term Attendance: {student.attendance}%
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.attendanceToggleBtn,
                      student.presentToday ? styles.presentBtn : styles.absentBtn,
                    ]}
                    onPress={() => toggleStudentAttendance(student.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.attendanceToggleText,
                        student.presentToday ? styles.presentText : styles.absentText,
                      ]}
                    >
                      {student.presentToday ? 'Present' : 'Absent'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </Card>
          </View>
        ) : (
          /* List of assigned classes */
          <View>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Assigned Teaching Classes</Text>
                <Text style={styles.sectionSubtitle}>Current academic semester allocations</Text>
              </View>
            </View>

            {teacherClasses.map((cls) => (
              <Card key={cls.id} style={styles.classListItemCard}>
                <View style={styles.classItemTop}>
                  <View style={styles.codePill}>
                    <Text style={styles.codePillText}>{cls.subjectCode}</Text>
                  </View>
                  <Badge label={`${cls.studentCount} Students`} variant="primary" size="sm" />
                </View>

                <Text style={styles.classItemTitle}>{cls.subjectName}</Text>
                <Text style={styles.classItemMeta}>
                  Semester {cls.semester} • {cls.section} • {cls.classRoom}
                </Text>
                <Text style={styles.scheduleText}>{cls.scheduleTime}</Text>

                <View style={styles.classItemStats}>
                  <View style={styles.statCol}>
                    <Text style={styles.statVal}>{cls.averageAttendance}%</Text>
                    <Text style={styles.statLbl}>Attendance</Text>
                  </View>
                  <View style={styles.statCol}>
                    <Text style={styles.statVal}>{cls.averageMarks}%</Text>
                    <Text style={styles.statLbl}>Avg Score</Text>
                  </View>
                  <View style={styles.statCol}>
                    <Text style={[styles.statVal, { color: colors.warningText }]}>
                      {cls.pendingEvaluations}
                    </Text>
                    <Text style={styles.statLbl}>Pending Graded</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.openClassBtn}
                  onPress={() => setSelectedClass(cls)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.openClassBtnText}>Manage Class & Mark Attendance</Text>
                  <Ionicons name="arrow-forward" size={15} color="#FFF" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtnText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
    marginLeft: 4,
  },
  selectedClassCard: {
    padding: 16,
    marginBottom: 16,
  },
  classCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  classCode: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryLight,
  },
  className: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  classSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  classMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.cardBgSubtle,
    borderRadius: borderRadius.md,
    padding: 12,
  },
  classMetricItem: {
    alignItems: 'center',
  },
  classMetricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  classMetricLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  rosterSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  saveAttendanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
  },
  saveAttendanceBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  rosterCard: {
    padding: 8,
  },
  rosterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  rosterRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  studentInfo: {
    flex: 1,
  },
  studentNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  studentRollText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  attendanceToggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  presentBtn: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
  },
  absentBtn: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.danger,
  },
  attendanceToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  presentText: {
    color: colors.successText,
  },
  absentText: {
    color: colors.dangerText,
  },
  classListItemCard: {
    padding: 16,
    marginBottom: 12,
  },
  classItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codePill: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  codePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  classItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  classItemMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  scheduleText: {
    fontSize: 12,
    color: colors.primaryLight,
    fontWeight: '500',
    marginBottom: 12,
  },
  classItemStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBgSubtle,
    borderRadius: borderRadius.md,
    padding: 10,
    marginBottom: 12,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLbl: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  openClassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  openClassBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
