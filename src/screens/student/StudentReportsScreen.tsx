import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius } from '../../theme';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';

interface StudentReportsScreenProps {
  initialSubTab?: string;
}

export const StudentReportsScreen: React.FC<StudentReportsScreenProps> = ({ initialSubTab }) => {
  const {
    attendance,
    biometricToday,
    biometricHistory,
    results,
    examForm,
    noDues,
  } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<string>(initialSubTab || 'attendance');

  const reportTabs = [
    { key: 'attendance', label: 'Attendance' },
    { key: 'results', label: 'Results' },
    { key: 'examForm', label: 'Exam Form' },
    { key: 'noDues', label: 'No-Dues' },
    { key: 'performance', label: 'Performance' },
  ];

  // Calculate overall attendance
  const totalAttended = attendance.reduce((acc, a) => acc + a.attended, 0);
  const totalConducted = attendance.reduce((acc, a) => acc + a.conducted, 0);
  const overallAttendancePercent = Math.round((totalAttended / totalConducted) * 100);

  // Calculate no dues percentage
  const clearedDuesCount = noDues.filter((d) => d.status === 'Cleared').length;
  const noDuesPercent = Math.round((clearedDuesCount / noDues.length) * 100);

  // Render Attendance Tab (Sections 20, 21, 22)
  const renderAttendanceTab = () => {
    const warningSubjects = attendance.filter((a) => a.percentage < 75);

    return (
      <View>
        {/* Section 22: Attendance Warning Alert */}
        {warningSubjects.length > 0 && (
          <View style={styles.alertBanner}>
            <View style={styles.alertIconCircle}>
              <Ionicons name="warning" size={20} color={colors.warningText} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Attendance Alert</Text>
              {warningSubjects.map((ws) => (
                <Text key={ws.subjectId} style={styles.alertDesc}>
                  Your {ws.subjectName} attendance is {ws.percentage}%. Required attendance is 75% to appear in final exams.
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Overall Attendance Summary Card */}
        <Card style={styles.overallAttendanceCard}>
          <View style={styles.overallTopRow}>
            <View>
              <Text style={styles.overallTitle}>Total Classroom Attendance</Text>
              <Text style={styles.overallSub}>
                {totalAttended} of {totalConducted} classes attended
              </Text>
            </View>
            <View style={styles.percentBadge}>
              <Text style={styles.percentBadgeNumber}>{overallAttendancePercent}%</Text>
            </View>
          </View>
          <ProgressBar
            progress={overallAttendancePercent}
            color={overallAttendancePercent >= 75 ? colors.success : colors.danger}
            height={8}
          />
        </Card>

        {/* Section 20: Subject-Wise Attendance Breakdown */}
        <Text style={styles.sectionHeading}>Subject-Wise Classroom Attendance</Text>
        {attendance.map((sub) => {
          const isWarning = sub.percentage < 75;
          return (
            <Card key={sub.subjectId} style={styles.attendanceCard} highlightBorder={isWarning ? colors.danger : colors.success}>
              <View style={styles.attHeaderRow}>
                <View>
                  <Text style={styles.attSubCode}>{sub.subjectCode}</Text>
                  <Text style={styles.attSubName}>{sub.subjectName}</Text>
                </View>
                <Badge
                  label={`${sub.percentage}%`}
                  variant={isWarning ? 'danger' : 'success'}
                  size="md"
                />
              </View>

              <View style={styles.attStatsRow}>
                <Text style={styles.attStatsText}>
                  Attended: <Text style={styles.statBold}>{sub.attended}</Text> / {sub.conducted} classes
                </Text>
                <Text style={styles.attStatsText}>
                  Missed: <Text style={[styles.statBold, isWarning && { color: colors.dangerText }]}>{sub.conducted - sub.attended}</Text>
                </Text>
              </View>

              <ProgressBar
                progress={sub.percentage}
                color={isWarning ? colors.danger : colors.success}
                height={6}
              />
            </Card>
          );
        })}

        {/* Section 21: Biometric Attendance */}
        <Text style={[styles.sectionHeading, { marginTop: 18 }]}>Biometric Campus Attendance</Text>
        <Card style={styles.biometricCard}>
          <View style={styles.biometricTodayRow}>
            <View style={styles.bioIconCircle}>
              <Ionicons name="finger-print" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bioTodayTitle}>Today: {biometricToday.date}</Text>
              <Text style={styles.bioTimeText}>
                Check-In: <Text style={{ fontWeight: '700', color: colors.textPrimary }}>{biometricToday.checkIn}</Text>
              </Text>
              <Text style={styles.bioTimeText}>
                Check-Out: <Text style={{ color: colors.textSecondary }}>{biometricToday.checkOut}</Text>
              </Text>
            </View>
            <Badge label={biometricToday.status} variant="success" size="md" />
          </View>

          <Text style={styles.bioHistoryHeader}>Recent Biometric Logs</Text>
          {biometricHistory.map((log) => (
            <View key={log.id} style={styles.bioLogRow}>
              <Text style={styles.bioLogDate}>{log.date}</Text>
              <Text style={styles.bioLogTimes}>{log.checkIn} – {log.checkOut}</Text>
              <Badge
                label={log.status}
                variant={log.status === 'Present' ? 'success' : 'warning'}
                size="sm"
              />
            </View>
          ))}
        </Card>
      </View>
    );
  };

  // Render Results Tab (Section 23)
  const renderResultsTab = () => {
    return (
      <View>
        <Text style={styles.sectionHeading}>Official Academic Grade Sheets</Text>
        <Text style={styles.sectionSubHeading}>Cumulative Grade Point Average (CGPA): 8.42 / 10</Text>

        {results.map((sem) => (
          <Card key={sem.semester} style={styles.resultCard}>
            <View style={styles.resultCardHeader}>
              <View>
                <Text style={styles.semTitle}>Semester {sem.semester}</Text>
                <Text style={styles.creditsText}>Total Credits Earned: {sem.totalCredits}</Text>
              </View>
              <View style={styles.sgpaBadge}>
                <Text style={styles.sgpaText}>{sem.sgpa.toFixed(2)}</Text>
                <Text style={styles.sgpaSub}>SGPA</Text>
              </View>
            </View>

            <View style={styles.gradesTable}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.colHeader, { flex: 2 }]}>Subject</Text>
                <Text style={[styles.colHeader, { flex: 1, textAlign: 'center' }]}>Credits</Text>
                <Text style={[styles.colHeader, { flex: 1, textAlign: 'right' }]}>Grade</Text>
              </View>

              {sem.subjects.map((sub, i) => (
                <View key={i} style={styles.tableRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.subCodeRow}>{sub.code}</Text>
                    <Text style={styles.subNameRow} numberOfLines={1}>{sub.name}</Text>
                  </View>
                  <Text style={[styles.subCreditRow, { flex: 1, textAlign: 'center' }]}>
                    {sub.credits}
                  </Text>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <View style={styles.gradeBadge}>
                      <Text style={styles.gradeText}>{sub.grade}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        ))}
      </View>
    );
  };

  // Render Exam Form Tab (Section 24)
  const renderExamFormTab = () => {
    return (
      <View>
        <Text style={styles.sectionHeading}>Examination Registration Form</Text>
        <Card style={styles.examFormCard}>
          <View style={styles.formHeader}>
            <View>
              <Text style={styles.formName}>{examForm.examName}</Text>
              <Text style={styles.formNumber}>Form No: {examForm.formNumber}</Text>
            </View>
            <Badge label={examForm.status} variant="success" size="md" />
          </View>

          <View style={styles.formDetailsGrid}>
            <View style={styles.formDetailItem}>
              <Text style={styles.formLabel}>Submitted Date</Text>
              <Text style={styles.formValue}>{examForm.submissionDate}</Text>
            </View>
            <View style={styles.formDetailItem}>
              <Text style={styles.formLabel}>Exam Fee Status</Text>
              <Text style={[styles.formValue, { color: colors.successText }]}>
                ₹{examForm.examFee} ({examForm.paymentStatus})
              </Text>
            </View>
            <View style={styles.formDetailItem}>
              <Text style={styles.formLabel}>Verification Authority</Text>
              <Text style={styles.formValue}>{examForm.verificationAuthority}</Text>
            </View>
          </View>

          <Text style={styles.selectedSubsTitle}>Registered Examination Subjects:</Text>
          {examForm.selectedSubjects.map((sub, idx) => (
            <View key={idx} style={styles.selectedSubRow}>
              <Ionicons name="checkmark-done" size={16} color={colors.primaryLight} />
              <Text style={styles.selectedSubText}>{sub}</Text>
            </View>
          ))}
        </Card>
      </View>
    );
  };

  // Render No-Dues Tab (Section 25)
  const renderNoDuesTab = () => {
    return (
      <View>
        <Card style={styles.noDuesSummaryCard}>
          <View style={styles.noDuesTopRow}>
            <View>
              <Text style={styles.noDuesTitle}>Digital No-Dues Clearance</Text>
              <Text style={styles.noDuesSub}>
                {clearedDuesCount} of {noDues.length} departments cleared
              </Text>
            </View>
            <View style={styles.noDuesGauge}>
              <Text style={styles.noDuesGaugeText}>{noDuesPercent}%</Text>
              <Text style={styles.noDuesGaugeSub}>Cleared</Text>
            </View>
          </View>
          <ProgressBar progress={noDuesPercent} color={colors.secondary} height={8} />
        </Card>

        <Text style={styles.sectionHeading}>Department Clearances</Text>
        {noDues.map((dept) => {
          const isCleared = dept.status === 'Cleared';
          return (
            <Card key={dept.id} style={styles.noDuesItemCard} highlightBorder={isCleared ? colors.success : colors.warning}>
              <View style={styles.noDuesItemTop}>
                <View style={styles.deptIconCircle}>
                  <Ionicons
                    name={isCleared ? 'checkmark-circle' : 'time-outline'}
                    size={20}
                    color={isCleared ? colors.success : colors.warning}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deptName}>{dept.department}</Text>
                  <Text style={styles.deptRemarks}>{dept.remarks}</Text>
                </View>
                <Badge
                  label={dept.status}
                  variant={isCleared ? 'success' : 'warning'}
                  size="sm"
                />
              </View>

              {dept.clearedBy && (
                <View style={styles.clearedByRow}>
                  <Ionicons name="shield-checkmark-outline" size={13} color={colors.textMuted} />
                  <Text style={styles.clearedByText}>
                    Authorized by: {dept.clearedBy} ({dept.clearedDate})
                  </Text>
                </View>
              )}
            </Card>
          );
        })}
      </View>
    );
  };

  // Render Academic Performance Overview (Section 26)
  const renderPerformanceTab = () => {
    return (
      <View>
        <Text style={styles.sectionHeading}>Semester Academic Health Overview</Text>
        <Text style={styles.sectionSubHeading}>Consolidated learning indicators</Text>

        <View style={styles.perfGrid}>
          <Card style={styles.perfCard}>
            <Ionicons name="finger-print" size={24} color={colors.primary} />
            <Text style={styles.perfValue}>{overallAttendancePercent}%</Text>
            <Text style={styles.perfLabel}>Attendance</Text>
            <Text style={styles.perfSub}>Min 75% required</Text>
          </Card>

          <Card style={styles.perfCard}>
            <Ionicons name="document-text" size={24} color={colors.secondary} />
            <Text style={styles.perfValue}>88%</Text>
            <Text style={styles.perfLabel}>Assignments</Text>
            <Text style={styles.perfSub}>3/4 submitted</Text>
          </Card>

          <Card style={styles.perfCard}>
            <Ionicons name="trophy" size={24} color={colors.warning} />
            <Text style={styles.perfValue}>8.42</Text>
            <Text style={styles.perfLabel}>Current SGPA</Text>
            <Text style={styles.perfSub}>First Class Distinction</Text>
          </Card>

          <Card style={styles.perfCard}>
            <Ionicons name="book" size={24} color={colors.purple} />
            <Text style={styles.perfValue}>60%</Text>
            <Text style={styles.perfLabel}>Syllabus Covered</Text>
            <Text style={styles.perfSub}>Mid-sem ready</Text>
          </Card>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* Section 19: Horizontal Tabs for Reports */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {reportTabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.reportTab, activeReportTab === tab.key && styles.activeReportTab]}
              onPress={() => setActiveReportTab(tab.key)}
            >
              <Text style={[styles.reportTabText, activeReportTab === tab.key && styles.activeReportTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeReportTab === 'attendance' && renderAttendanceTab()}
        {activeReportTab === 'results' && renderResultsTab()}
        {activeReportTab === 'examForm' && renderExamFormTab()}
        {activeReportTab === 'noDues' && renderNoDuesTab()}
        {activeReportTab === 'performance' && renderPerformanceTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsScroll: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  reportTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.cardBgSubtle,
  },
  activeReportTab: {
    backgroundColor: colors.primary,
  },
  reportTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeReportTabText: {
    color: '#FFF',
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubHeading: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warningLight,
    borderWidth: 1,
    borderColor: colors.warning,
    padding: 14,
    borderRadius: borderRadius.md,
    marginBottom: 14,
  },
  alertIconCircle: {
    marginRight: 10,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.warningText,
    marginBottom: 4,
  },
  alertDesc: {
    fontSize: 12,
    color: colors.warningText,
    lineHeight: 17,
  },
  overallAttendanceCard: {
    padding: 16,
    marginBottom: 14,
  },
  overallTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  overallTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  overallSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  percentBadge: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  percentBadgeNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  attendanceCard: {
    padding: 14,
    marginBottom: 10,
  },
  attHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  attSubCode: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryLight,
  },
  attSubName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  attStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  attStatsText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statBold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  biometricCard: {
    padding: 16,
  },
  biometricTodayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 12,
  },
  bioIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bioTodayTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bioTimeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bioHistoryHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  bioLogRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  bioLogDate: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  bioLogTimes: {
    fontSize: 11,
    color: colors.textMuted,
  },
  resultCard: {
    padding: 16,
    marginBottom: 14,
  },
  resultCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
    marginBottom: 10,
  },
  semTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  creditsText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sgpaBadge: {
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
  },
  sgpaText: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primary,
  },
  sgpaSub: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  gradesTable: {
    gap: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  colHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  subCodeRow: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  subNameRow: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  subCreditRow: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  gradeBadge: {
    backgroundColor: colors.cardBgSubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  examFormCard: {
    padding: 16,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  formName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  formNumber: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  formDetailsGrid: {
    backgroundColor: colors.cardBgSubtle,
    borderRadius: borderRadius.md,
    padding: 12,
    gap: 8,
    marginBottom: 14,
  },
  formDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  formValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  selectedSubsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  selectedSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  selectedSubText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  noDuesSummaryCard: {
    padding: 16,
    marginBottom: 14,
  },
  noDuesTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  noDuesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  noDuesSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  noDuesGauge: {
    alignItems: 'center',
    backgroundColor: colors.secondaryTint,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
  },
  noDuesGaugeText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.secondary,
  },
  noDuesGaugeSub: {
    fontSize: 9,
    color: colors.secondary,
  },
  noDuesItemCard: {
    padding: 14,
    marginBottom: 10,
  },
  noDuesItemTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  deptIconCircle: {
    marginRight: 10,
    marginTop: 2,
  },
  deptName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  deptRemarks: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  clearedByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clearedByText: {
    fontSize: 10,
    color: colors.textMuted,
    marginLeft: 4,
  },
  perfGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  perfCard: {
    width: '48%',
    padding: 14,
    alignItems: 'center',
  },
  perfValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 6,
  },
  perfLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  perfSub: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
});
