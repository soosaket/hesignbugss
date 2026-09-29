import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Assignment, AssignmentSubmission } from '../../types';

interface TeacherAssignmentsScreenProps {
  initialOpenCreate?: boolean;
}

export const TeacherAssignmentsScreen: React.FC<TeacherAssignmentsScreenProps> = ({
  initialOpenCreate,
}) => {
  const {
    assignments,
    createAssignment,
    evaluateSubmission,
    teacherSubmissions,
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(!!initialOpenCreate);
  const [selectedAssignmentForReview, setSelectedAssignmentForReview] = useState<Assignment | null>(null);
  const [selectedSubmissionToGrade, setSelectedSubmissionToGrade] = useState<AssignmentSubmission | null>(null);
  const [selectedSimilarityItem, setSelectedSimilarityItem] = useState<AssignmentSubmission | null>(null);

  // New assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Python Programming');
  const [newDeadline, setNewDeadline] = useState('Oct 10, 11:59 PM');
  const [newMarks, setNewMarks] = useState('25');
  const [newAllowLate, setNewAllowLate] = useState(false);
  const [newInstructions, setNewInstructions] = useState('');

  // Grading form state
  const [gradeMarks, setGradeMarks] = useState('22');
  const [gradeFeedback, setGradeFeedback] = useState('Solid implementation of abstract classes.');

  const handleCreateSubmit = () => {
    if (!newTitle.trim()) {
      Alert.alert('Incomplete Title', 'Please enter assignment title.');
      return;
    }

    createAssignment({
      title: newTitle,
      subjectId: 'sub_python',
      subjectName: newSubject,
      facultyName: 'Dr. Rajiv Sharma',
      section: 'Section A',
      deadline: '2026-10-10T23:59:00',
      deadlineFormatted: newDeadline,
      totalMarks: parseInt(newMarks, 10) || 20,
      allowLate: newAllowLate,
      instructions: newInstructions || 'Follow all standard lab formatting instructions.',
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewInstructions('');
    Alert.alert('Assignment Created & Broadcasted! 📢', 'All enrolled students have received a notification with the submission deadline.');
  };

  const handleGradeConfirm = () => {
    if (!selectedAssignmentForReview || !selectedSubmissionToGrade) return;

    evaluateSubmission(
      selectedAssignmentForReview.id,
      selectedSubmissionToGrade.id,
      parseInt(gradeMarks, 10) || 20,
      gradeFeedback
    );

    setSelectedSubmissionToGrade(null);
    Alert.alert('Grade & Feedback Recorded! ✓', 'Student has been notified with the updated marksheet and feedback.');
  };

  const currentSubmissions = selectedAssignmentForReview
    ? teacherSubmissions[selectedAssignmentForReview.id] || []
    : [];

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {selectedAssignmentForReview ? (
          /* Submission Evaluation Console (Section 36 & 37) */
          <View>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setSelectedAssignmentForReview(null)}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={18} color={colors.primary} />
              <Text style={styles.backBtnText}>All Assignments</Text>
            </TouchableOpacity>

            <Card style={styles.reviewHeaderCard} highlightBorder={colors.primary}>
              <Text style={styles.reviewAsgTitle}>{selectedAssignmentForReview.title}</Text>
              <Text style={styles.reviewAsgSub}>
                {selectedAssignmentForReview.subjectName} • Due: {selectedAssignmentForReview.deadlineFormatted}
              </Text>

              {/* Section 39: Performance Analytics */}
              <View style={styles.analyticsRow}>
                <View style={styles.analyticCol}>
                  <Text style={styles.analyticVal}>{selectedAssignmentForReview.submittedCount} / {selectedAssignmentForReview.totalStudents}</Text>
                  <Text style={styles.analyticLbl}>Submitted</Text>
                </View>
                <View style={styles.analyticCol}>
                  <Text style={styles.analyticVal}>76%</Text>
                  <Text style={styles.analyticLbl}>Class Average</Text>
                </View>
                <View style={styles.analyticCol}>
                  <Text style={[styles.analyticVal, { color: colors.warningText }]}>
                    {selectedAssignmentForReview.pendingCount}
                  </Text>
                  <Text style={styles.analyticLbl}>Pending Evaluation</Text>
                </View>
              </View>
            </Card>

            <View style={styles.submissionsSectionHeader}>
              <Text style={styles.sectionTitle}>Student Submissions ({currentSubmissions.length})</Text>
              <Text style={styles.sectionSubtitle}>Grade work & inspect integrity scans</Text>
            </View>

            {currentSubmissions.map((sub) => {
              const isHighSimilarity = (sub.similarityScore || 0) >= 80;
              const isEvaluated = sub.status === 'evaluated';

              return (
                <Card key={sub.id} style={styles.submissionCard} highlightBorder={isHighSimilarity ? colors.danger : undefined}>
                  <View style={styles.subCardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.studentNameText}>{sub.studentName}</Text>
                      <Text style={styles.studentRollText}>{sub.studentRoll} • {sub.submittedAt}</Text>
                    </View>
                    <Badge
                      label={isEvaluated ? `Graded: ${sub.marksAwarded}/${selectedAssignmentForReview.totalMarks}` : 'Pending Grade'}
                      variant={isEvaluated ? 'success' : 'warning'}
                      size="sm"
                    />
                  </View>

                  {/* Section 37: AI Similarity Detection Flag */}
                  {isHighSimilarity && (
                    <TouchableOpacity
                      style={styles.similarityAlertBox}
                      onPress={() => setSelectedSimilarityItem(sub)}
                      activeOpacity={0.8}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Ionicons name="warning" size={16} color={colors.danger} />
                        <View style={{ marginLeft: 8 }}>
                          <Text style={styles.similarityTitle}>
                            Similarity Alert: {sub.similarityScore}% Match
                          </Text>
                          <Text style={styles.similarityMatchedWith}>
                            With: {sub.similarityMatchedWith}
                          </Text>
                        </View>
                      </View>
                      <Badge label="Compare" variant="danger" size="sm" />
                    </TouchableOpacity>
                  )}

                  {/* Snippet preview */}
                  <View style={styles.previewBox}>
                    <Text style={styles.previewFileLabel}>
                      <Ionicons name="document-text" size={12} color={colors.textSecondary} /> {sub.fileName} ({sub.fileSize})
                    </Text>
                    <Text style={styles.previewSnippetText} numberOfLines={3}>
                      {sub.filePreviewText}
                    </Text>
                  </View>

                  {isEvaluated && sub.feedback && (
                    <Text style={styles.evaluatedFeedbackText}>
                      {'Recorded Feedback: "' + sub.feedback + '"'}
                    </Text>
                  )}

                  <TouchableOpacity
                    style={[styles.gradeActionBtn, isEvaluated && styles.regradeActionBtn]}
                    onPress={() => {
                      setSelectedSubmissionToGrade(sub);
                      setGradeMarks(String(sub.marksAwarded || 22));
                      setGradeFeedback(sub.feedback || 'Good formulation and tests.');
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isEvaluated ? 'create-outline' : 'checkmark-circle-outline'}
                      size={16}
                      color="#FFF"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.gradeActionBtnText}>
                      {isEvaluated ? 'Edit Marks & Feedback' : 'Evaluate & Grade Solution'}
                    </Text>
                  </TouchableOpacity>
                </Card>
              );
            })}
          </View>
        ) : (
          /* List of all assignments */
          <View>
            <View style={styles.topBar}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Course Assignments</Text>
                <Text style={styles.sectionSubtitle}>Manage tasks, deadlines, and submissions</Text>
              </View>
              <TouchableOpacity
                style={styles.createBtn}
                onPress={() => setIsCreateModalOpen(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={18} color="#FFF" style={{ marginRight: 4 }} />
                <Text style={styles.createBtnText}>Create New</Text>
              </TouchableOpacity>
            </View>

            {assignments.map((asg) => (
              <Card key={asg.id} style={styles.assignmentCard}>
                <View style={styles.asgHeader}>
                  <Badge label={asg.subjectName} variant="primary" size="sm" />
                  <Text style={styles.asgDeadline}>{asg.deadlineFormatted}</Text>
                </View>

                <Text style={styles.asgTitle}>{asg.title}</Text>
                <Text style={styles.asgInstructions} numberOfLines={2}>
                  {asg.instructions}
                </Text>

                <View style={styles.asgStatsRow}>
                  <View style={styles.asgStatCol}>
                    <Text style={styles.asgStatVal}>{asg.submittedCount} / {asg.totalStudents}</Text>
                    <Text style={styles.asgStatLbl}>Submissions</Text>
                  </View>
                  <View style={styles.asgStatCol}>
                    <Text style={styles.asgStatVal}>{asg.totalMarks}</Text>
                    <Text style={styles.asgStatLbl}>Total Marks</Text>
                  </View>
                  <View style={styles.asgStatCol}>
                    <Text style={[styles.asgStatVal, { color: colors.warningText }]}>
                      {asg.pendingCount}
                    </Text>
                    <Text style={styles.asgStatLbl}>Pending</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.evaluateBtn}
                  onPress={() => setSelectedAssignmentForReview(asg)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.evaluateBtnText}>Review Submissions & AI Scan</Text>
                  <Ionicons name="arrow-forward" size={15} color="#FFF" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Section 35: Create Assignment Modal */}
      <Modal visible={isCreateModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Assignment</Text>
              <TouchableOpacity onPress={() => setIsCreateModalOpen(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 460 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput
                style={styles.input}
                value={newSubject}
                onChangeText={setNewSubject}
              />

              <Text style={[styles.inputLabel, { marginTop: 10 }]}>Assignment Title</Text>
              <TextInput
                style={styles.input}
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="e.g. Unit 3: File I/O & Exception Handling Practice"
              />

              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.inputLabel, { marginTop: 10 }]}>Deadline</Text>
                  <TextInput
                    style={styles.input}
                    value={newDeadline}
                    onChangeText={setNewDeadline}
                    placeholder="e.g. Tomorrow, 11:59 PM"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { marginTop: 10 }]}>Total Marks</Text>
                  <TextInput
                    style={styles.input}
                    value={newMarks}
                    onChangeText={setNewMarks}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Allow Late Submissions</Text>
                <Switch
                  value={newAllowLate}
                  onValueChange={setNewAllowLate}
                  trackColor={{ false: colors.borderDark, true: colors.primaryLight }}
                />
              </View>

              <Text style={[styles.inputLabel, { marginTop: 10 }]}>Instructions & Criteria</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newInstructions}
                onChangeText={setNewInstructions}
                multiline
                numberOfLines={3}
                placeholder="Specify submission guidelines and required format..."
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsCreateModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleCreateSubmit}
              >
                <Text style={styles.modalConfirmText}>Publish & Notify Class</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Section 36: Evaluate & Grade Modal */}
      <Modal visible={!!selectedSubmissionToGrade} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Grade Submission</Text>
                <Text style={styles.modalSub}>{selectedSubmissionToGrade?.studentName} ({selectedSubmissionToGrade?.studentRoll})</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedSubmissionToGrade(null)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Marks Awarded (Out of {selectedAssignmentForReview?.totalMarks})</Text>
            <TextInput
              style={styles.input}
              value={gradeMarks}
              onChangeText={setGradeMarks}
              keyboardType="number-pad"
            />

            <Text style={[styles.inputLabel, { marginTop: 10 }]}>Faculty Feedback & Guidance</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={gradeFeedback}
              onChangeText={setGradeFeedback}
              multiline
              numberOfLines={3}
              placeholder="Write feedback for the student..."
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setSelectedSubmissionToGrade(null)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleGradeConfirm}
              >
                <Text style={styles.modalConfirmText}>Save & Send Grade</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Section 37: AI Similarity Inspection Modal */}
      <Modal visible={!!selectedSimilarityItem} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="shield-outline" size={18} color={colors.danger} />
                  <Text style={[styles.modalTitle, { marginLeft: 6 }]}>AI Similarity Inspector</Text>
                </View>
                <Text style={styles.modalSub}>
                  Flag: {selectedSimilarityItem?.similarityScore}% High Structural Similarity
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedSimilarityItem(null)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.similarityNoticeHeader}>
                <Ionicons name="information-circle" size={18} color={colors.dangerText} />
                <Text style={styles.similarityNoticeHeaderText}>
                  This tool identifies semantic and code structure overlap for faculty review. It does not automatically accuse students of plagiarism.
                </Text>
              </View>

              {/* Side by side preview */}
              <View style={styles.diffComparisonBox}>
                <View style={styles.diffCol}>
                  <Text style={styles.diffStudentLabel}>
                    Student A: {selectedSimilarityItem?.studentName}
                  </Text>
                  <Text style={styles.diffCode}>
                    {selectedSimilarityItem?.filePreviewText}
                  </Text>
                </View>

                <View style={[styles.diffCol, { borderTopWidth: 1, borderTopColor: colors.border, marginTop: 10, paddingTop: 10 }]}>
                  <Text style={styles.diffStudentLabel}>
                    Matched With: {selectedSimilarityItem?.similarityMatchedWith}
                  </Text>
                  <Text style={styles.diffCode}>
                    {`class UniversityMember:\n    def __init__(self, name, id):\n        self.name = name\n        self.id = id\n\nclass Student(UniversityMember):\n    def calculate_gpa(self):\n        return sum(self.grades) / len(self.grades)`}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalConfirmBtn, { marginTop: 14 }]}
              onPress={() => setSelectedSimilarityItem(null)}
            >
              <Text style={styles.modalConfirmText}>Acknowledge & Close</Text>
            </TouchableOpacity>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.md,
  },
  createBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  assignmentCard: {
    padding: 14,
    marginBottom: 12,
  },
  asgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  asgDeadline: {
    fontSize: 11,
    color: colors.textMuted,
  },
  asgTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  asgInstructions: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginBottom: 10,
  },
  asgStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBgSubtle,
    borderRadius: borderRadius.md,
    padding: 10,
    marginBottom: 12,
  },
  asgStatCol: {
    alignItems: 'center',
    flex: 1,
  },
  asgStatVal: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  asgStatLbl: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  evaluateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
  },
  evaluateBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
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
  reviewHeaderCard: {
    padding: 16,
    marginBottom: 14,
  },
  reviewAsgTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reviewAsgSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.cardBgSubtle,
    borderRadius: borderRadius.md,
    padding: 10,
  },
  analyticCol: {
    alignItems: 'center',
  },
  analyticVal: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  analyticLbl: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  submissionsSectionHeader: {
    marginBottom: 10,
  },
  submissionCard: {
    padding: 14,
    marginBottom: 12,
  },
  subCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
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
  similarityAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.dangerLight,
    padding: 10,
    borderRadius: borderRadius.md,
    marginBottom: 10,
  },
  similarityTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.dangerText,
  },
  similarityMatchedWith: {
    fontSize: 11,
    color: colors.dangerText,
    marginTop: 1,
  },
  previewBox: {
    backgroundColor: colors.cardBgSubtle,
    borderRadius: borderRadius.md,
    padding: 10,
    marginBottom: 10,
  },
  previewFileLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  previewSnippetText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  evaluatedFeedbackText: {
    fontSize: 12,
    color: colors.successText,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  gradeActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
  },
  regradeActionBtn: {
    backgroundColor: colors.secondary,
  },
  gradeActionBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
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
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.cardBgSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.textPrimary,
  },
  formRow: {
    flexDirection: 'row',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  modalCancelText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modalConfirmBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  modalConfirmText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  similarityNoticeHeader: {
    flexDirection: 'row',
    backgroundColor: colors.dangerLight,
    padding: 10,
    borderRadius: borderRadius.md,
    marginBottom: 12,
  },
  similarityNoticeHeaderText: {
    fontSize: 11,
    color: colors.dangerText,
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
  diffComparisonBox: {
    backgroundColor: '#0F172A',
    borderRadius: borderRadius.md,
    padding: 12,
  },
  diffCol: {
    marginBottom: 4,
  },
  diffStudentLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 4,
  },
  diffCode: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#38BDF8',
    lineHeight: 16,
  },
});
