import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { Assignment } from '../../types';

interface StudentHomeScreenProps {
  onNavigateToTab: (tabIndex: number, params?: any) => void;
}

export const StudentHomeScreen: React.FC<StudentHomeScreenProps> = ({ onNavigateToTab }) => {
  const {
    todayClasses,
    assignments,
    announcements,
    upcomingExams,
    submitAssignment,
    openResourceViewer,
    resources,
  } = useApp();

  const [assignmentFilter, setAssignmentFilter] = useState<'pending' | 'submitted' | 'dueSoon'>('pending');
  const [selectedAsgForSubmit, setSelectedAsgForSubmit] = useState<Assignment | null>(null);
  const [submissionCode, setSubmissionCode] = useState('');
  const [submissionFileName, setSubmissionFileName] = useState('Rahul_Kumar_Solution.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);

  // Filter assignments
  const pendingAssignments = assignments.filter((a) => a.status === 'pending');
  const submittedAssignments = assignments.filter((a) => a.status === 'submitted' || a.status === 'evaluated');
  const dueSoonAssignments = assignments.filter((a) => a.status === 'pending');

  const displayedAssignments =
    assignmentFilter === 'pending'
      ? pendingAssignments
      : assignmentFilter === 'submitted'
      ? submittedAssignments
      : dueSoonAssignments;

  const handleOpenSubmit = (asg: Assignment) => {
    setSelectedAsgForSubmit(asg);
    setSubmissionFileName(`${asg.subjectName.replace(/\s+/g, '_')}_Solution.pdf`);
    setSubmissionCode(
      `# Solution for ${asg.title}\nclass Implementation:\n    def execute(self):\n        return "Model loaded successfully"`
    );
  };

  const handleConfirmSubmit = () => {
    if (!selectedAsgForSubmit) return;
    setIsSubmitting(true);
    setTimeout(() => {
      submitAssignment(selectedAsgForSubmit.id, submissionFileName, submissionCode);
      setIsSubmitting(false);
      setSelectedAsgForSubmit(null);
      Alert.alert(
        'Submission Successful! 🎉',
        `Your solution "${submissionFileName}" for ${selectedAsgForSubmit.title} has been submitted for evaluation.`
      );
    }, 700);
  };

  const quickAccessButtons = [
    { label: 'Syllabus', icon: 'list-outline' as const, color: colors.primary, action: () => onNavigateToTab(1, { subTab: 'syllabus' }) },
    { label: 'Notes', icon: 'book-outline' as const, color: colors.secondary, action: () => onNavigateToTab(1, { subTab: 'notes' }) },
    { label: 'PYQs', icon: 'help-circle-outline' as const, color: colors.warning, action: () => onNavigateToTab(1, { subTab: 'pyqs' }) },
    { label: 'Assignments', icon: 'document-text-outline' as const, color: colors.purple, action: () => setAssignmentFilter('pending') },
    { label: 'Exams', icon: 'calendar-outline' as const, color: colors.danger, action: () => onNavigateToTab(1, { subTab: 'exams' }) },
    { label: 'Attendance', icon: 'finger-print-outline' as const, color: colors.info, action: () => onNavigateToTab(2, { subTab: 'attendance' }) },
    { label: 'Results', icon: 'trophy-outline' as const, color: '#10B981', action: () => onNavigateToTab(2, { subTab: 'results' }) },
  ];

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 7: SMART PRIORITY SECTION ("Your Priorities") */}
        <View style={styles.priorityBox}>
          <View style={styles.priorityHeader}>
            <Ionicons name="flash" size={16} color={colors.warning} />
            <Text style={styles.priorityTitle}>Your Priorities</Text>
          </View>
          <View style={styles.priorityList}>
            <TouchableOpacity
              style={styles.priorityItem}
              onPress={() => pendingAssignments[0] && handleOpenSubmit(pendingAssignments[0])}
            >
              <View style={[styles.priorityNumberBadge, { backgroundColor: colors.dangerLight }]}>
                <Text style={[styles.priorityNumber, { color: colors.dangerText }]}>1</Text>
              </View>
              <Text style={styles.priorityItemText} numberOfLines={1}>
                Python Assignment 03 — <Text style={styles.boldText}>Due Tomorrow</Text>
              </Text>
              <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.priorityItem}
              onPress={() => {
                const note = resources.find((r) => r.type === 'notes');
                if (note) openResourceViewer(note);
              }}
            >
              <View style={[styles.priorityNumberBadge, { backgroundColor: colors.infoLight }]}>
                <Text style={[styles.priorityNumber, { color: colors.infoText }]}>2</Text>
              </View>
              <Text style={styles.priorityItemText} numberOfLines={1}>
                Python OOP Unit 2 — <Text style={styles.boldText}>New Notes Available</Text>
              </Text>
              <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.priorityItem}
              onPress={() => onNavigateToTab(1, { subTab: 'exams' })}
            >
              <View style={[styles.priorityNumberBadge, { backgroundColor: colors.warningLight }]}>
                <Text style={[styles.priorityNumber, { color: colors.warningText }]}>3</Text>
              </View>
              <Text style={styles.priorityItemText} numberOfLines={1}>
                Mid-Semester Exams — <Text style={styles.boldText}>16 Days Left</Text>
              </Text>
              <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 6: ACADEMIC QUICK ACCESS */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Academic Quick Access</Text>
          <Text style={styles.sectionSubtitle}>One tap access</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickAccessScroll}>
          {quickAccessButtons.map((btn, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickAccessTile}
              onPress={btn.action}
              activeOpacity={0.7}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: btn.color + '15' }]}>
                <Ionicons name={btn.icon} size={22} color={btn.color} />
              </View>
              <Text style={styles.quickAccessLabel}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section 3: TODAY'S CLASSES */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>{"Today's Classes"}</Text>
            <Text style={styles.sectionSubtitle}>Semester 2 • Section A Timetable</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigateToTab(1)} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>Full Schedule</Text>
          </TouchableOpacity>
        </View>

        {todayClasses.map((cls) => {
          const isLive = cls.status === 'live';
          return (
            <Card key={cls.id} style={styles.classCard} highlightBorder={isLive ? colors.danger : colors.primaryLight}>
              <View style={styles.classCardTop}>
                <View style={styles.timeTag}>
                  <Ionicons name="time-outline" size={13} color={colors.primary} />
                  <Text style={styles.timeText}>{cls.startTime} – {cls.endTime}</Text>
                </View>
                <Badge
                  label={cls.timeNotice || (isLive ? 'Live Now' : 'Upcoming')}
                  variant={isLive ? 'danger' : 'primary'}
                  size="sm"
                />
              </View>

              <Text style={styles.subjectName}>{cls.subjectName}</Text>

              <View style={styles.classFooter}>
                <View style={styles.classFooterItem}>
                  <Ionicons name="person-circle-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.classFooterText}>{cls.facultyName}</Text>
                </View>
                <View style={styles.classFooterItem}>
                  <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.classFooterText}>{cls.room}</Text>
                </View>
              </View>
            </Card>
          );
        })}

        {/* Section 4: ASSIGNMENT SUMMARY */}
        <View style={[styles.sectionHeaderRow, { marginTop: 14 }]}>
          <View>
            <Text style={styles.sectionTitle}>Assignment Summary</Text>
            <Text style={styles.sectionSubtitle}>Submissions & Deadlines</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.assignmentTabs}>
          <TouchableOpacity
            style={[styles.asgTab, assignmentFilter === 'pending' && styles.activeAsgTab]}
            onPress={() => setAssignmentFilter('pending')}
          >
            <Text style={[styles.asgTabText, assignmentFilter === 'pending' && styles.activeAsgTabText]}>
              Pending ({pendingAssignments.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.asgTab, assignmentFilter === 'dueSoon' && styles.activeAsgTab]}
            onPress={() => setAssignmentFilter('dueSoon')}
          >
            <Text style={[styles.asgTabText, assignmentFilter === 'dueSoon' && styles.activeAsgTabText]}>
              Due Soon
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.asgTab, assignmentFilter === 'submitted' && styles.activeAsgTab]}
            onPress={() => setAssignmentFilter('submitted')}
          >
            <Text style={[styles.asgTabText, assignmentFilter === 'submitted' && styles.activeAsgTabText]}>
              Submitted ({submittedAssignments.length})
            </Text>
          </TouchableOpacity>
        </View>

        {displayedAssignments.length === 0 ? (
          <EmptyState
            icon="checkmark-done-circle-outline"
            title="You're all caught up! 🎉"
            description="No pending assignments in this view. Great job staying ahead!"
          />
        ) : (
          displayedAssignments.map((asg) => {
            const isEvaluated = asg.status === 'evaluated';
            const isSubmitted = asg.status === 'submitted';

            return (
              <Card key={asg.id} style={styles.assignmentCard}>
                <View style={styles.asgHeader}>
                  <Text style={styles.asgSubject}>{asg.subjectName}</Text>
                  <Badge
                    label={isEvaluated ? `Evaluated: ${asg.submission?.marksAwarded}/${asg.totalMarks}` : isSubmitted ? 'Submitted' : 'Pending'}
                    variant={isEvaluated ? 'success' : isSubmitted ? 'info' : 'warning'}
                    size="sm"
                  />
                </View>

                <Text style={styles.asgTitle}>{asg.title}</Text>

                <View style={styles.asgDeadlineRow}>
                  <Ionicons name="calendar-outline" size={13} color={colors.textSecondary} />
                  <Text style={styles.asgDeadlineText}>Due: {asg.deadlineFormatted}</Text>
                  <Text style={styles.asgMarksText}>• {asg.totalMarks} Marks</Text>
                </View>

                {isEvaluated && asg.submission?.feedback && (
                  <View style={styles.feedbackBox}>
                    <Ionicons name="chatbubble-ellipses-outline" size={14} color={colors.successText} />
                    <Text style={styles.feedbackText}>
                      {'Faculty Feedback: "' + asg.submission.feedback + '"'}
                    </Text>
                  </View>
                )}

                {!isSubmitted && !isEvaluated ? (
                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={() => handleOpenSubmit(asg)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="cloud-upload-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.submitBtnText}>Submit Now</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.submittedInfoRow}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                    <Text style={styles.submittedInfoText}>
                      File: {asg.submission?.fileName} ({asg.submission?.submittedAt})
                    </Text>
                  </View>
                )}
              </Card>
            );
          })
        )}

        {/* Section 5: IMPORTANT ANNOUNCEMENTS */}
        <View style={[styles.sectionHeaderRow, { marginTop: 14 }]}>
          <View>
            <Text style={styles.sectionTitle}>Important Announcements</Text>
            <Text style={styles.sectionSubtitle}>From College & Department</Text>
          </View>
          <TouchableOpacity onPress={() => setShowAllAnnouncements(!showAllAnnouncements)} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>{showAllAnnouncements ? 'Show Less' : 'View All'}</Text>
          </TouchableOpacity>
        </View>

        {(showAllAnnouncements ? announcements : announcements.slice(0, 2)).map((anc) => (
          <Card key={anc.id} style={styles.announcementCard} highlightBorder={anc.isUrgent ? colors.danger : colors.info}>
            <View style={styles.ancHeader}>
              <Badge label={anc.category} variant={anc.isUrgent ? 'danger' : 'info'} size="sm" />
              <Text style={styles.ancDate}>{anc.date}</Text>
            </View>
            <Text style={styles.ancTitle}>{anc.title}</Text>
            <Text style={styles.ancContent}>{anc.content}</Text>
            <View style={styles.ancAuthorRow}>
              <Ionicons name="school-outline" size={13} color={colors.textMuted} />
              <Text style={styles.ancAuthorText}>{anc.authorName} ({anc.authorRole})</Text>
            </View>
          </Card>
        ))}

        {/* Section 8: UPCOMING DEADLINES */}
        <View style={[styles.sectionHeaderRow, { marginTop: 14 }]}>
          <View>
            <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
            <Text style={styles.sectionSubtitle}>Chronological Academic Milestones</Text>
          </View>
        </View>

        <Card style={styles.deadlinesCard}>
          {upcomingExams.map((ex, index) => (
            <View key={ex.id} style={[styles.deadlineRow, index !== upcomingExams.length - 1 && styles.deadlineRowBorder]}>
              <View style={styles.deadlineIconBox}>
                <Ionicons name="calendar" size={18} color={colors.primaryLight} />
              </View>
              <View style={styles.deadlineDetails}>
                <Text style={styles.deadlineTitle}>{ex.examName}: {ex.subjectName}</Text>
                <Text style={styles.deadlineSub}>{ex.date} • {ex.time} ({ex.room})</Text>
              </View>
              <View style={styles.countdownBadge}>
                <Text style={styles.countdownText}>{ex.remainingDays}d</Text>
                <Text style={styles.countdownSub}>left</Text>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>

      {/* Interactive Submission Modal */}
      <Modal visible={!!selectedAsgForSubmit} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Submit Assignment</Text>
                <Text style={styles.modalSub}>{selectedAsgForSubmit?.title}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedAsgForSubmit(null)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>File Name / Attachment</Text>
              <TextInput
                style={styles.textInput}
                value={submissionFileName}
                onChangeText={setSubmissionFileName}
                placeholder="FileName.pdf"
              />

              <Text style={[styles.inputLabel, { marginTop: 12 }]}>Solution Code / Summary Preview</Text>
              <TextInput
                style={[styles.textInput, styles.codeTextArea]}
                value={submissionCode}
                onChangeText={setSubmissionCode}
                multiline
                numberOfLines={6}
                placeholder="Paste code or summary..."
              />

              <View style={styles.submitNotice}>
                <Ionicons name="shield-checkmark-outline" size={16} color={colors.secondary} />
                <Text style={styles.submitNoticeText}>
                  Your submission will be timestamped and scanned for integrity before faculty grading.
                </Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setSelectedAsgForSubmit(null)}
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmModalBtn, isSubmitting && { opacity: 0.7 }]}
                onPress={handleConfirmSubmit}
                disabled={isSubmitting}
              >
                <Text style={styles.confirmModalText}>
                  {isSubmitting ? 'Uploading...' : 'Confirm Hand In'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  priorityBox: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    ...shadows.soft,
  },
  priorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priorityTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginLeft: 6,
    letterSpacing: 0.3,
  },
  priorityList: {
    gap: 8,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  priorityNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  priorityNumber: {
    fontSize: 12,
    fontWeight: '800',
  },
  priorityItemText: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  boldText: {
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  quickAccessScroll: {
    paddingVertical: 6,
    gap: 12,
    marginBottom: 16,
  },
  quickAccessTile: {
    alignItems: 'center',
    width: 72,
  },
  quickIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickAccessLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  classCard: {
    padding: 14,
    marginBottom: 10,
  },
  classCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  classFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  classFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classFooterText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  assignmentTabs: {
    flexDirection: 'row',
    backgroundColor: colors.cardBgSubtle,
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: 10,
  },
  asgTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  activeAsgTab: {
    backgroundColor: colors.cardBg,
    ...shadows.soft,
  },
  asgTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeAsgTabText: {
    color: colors.primary,
    fontWeight: '700',
  },
  assignmentCard: {
    padding: 14,
    marginBottom: 10,
  },
  asgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  asgSubject: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  asgTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  asgDeadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  asgDeadlineText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  asgMarksText: {
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 4,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.successLight,
    padding: 10,
    borderRadius: borderRadius.sm,
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 12,
    color: colors.successText,
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  submittedInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgSubtle,
    padding: 8,
    borderRadius: borderRadius.sm,
  },
  submittedInfoText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  announcementCard: {
    padding: 14,
    marginBottom: 10,
  },
  ancHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ancDate: {
    fontSize: 11,
    color: colors.textMuted,
  },
  ancTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  ancContent: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  ancAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ancAuthorText: {
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 4,
  },
  deadlinesCard: {
    padding: 14,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  deadlineRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  deadlineIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deadlineDetails: {
    flex: 1,
    marginRight: 8,
  },
  deadlineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  deadlineSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  countdownBadge: {
    alignItems: 'center',
    backgroundColor: colors.cardBgSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    minWidth: 42,
  },
  countdownText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  countdownSub: {
    fontSize: 9,
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: 20,
    ...shadows.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalBody: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: colors.cardBgSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.textPrimary,
  },
  codeTextArea: {
    height: 100,
    textAlignVertical: 'top',
    fontFamily: 'monospace',
    fontSize: 12,
  },
  submitNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryTint,
    padding: 10,
    borderRadius: borderRadius.md,
    marginTop: 12,
  },
  submitNoticeText: {
    fontSize: 11,
    color: colors.secondary,
    marginLeft: 6,
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelModalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelModalText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  confirmModalBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  confirmModalText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
