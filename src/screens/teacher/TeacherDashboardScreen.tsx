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

interface TeacherDashboardScreenProps {
  onNavigateToTab: (tabIndex: number, params?: any) => void;
}

export const TeacherDashboardScreen: React.FC<TeacherDashboardScreenProps> = ({ onNavigateToTab }) => {
  const {
    todayClasses,
    announcements,
    teacher,
    createAnnouncement,
  } = useApp();

  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annTarget, setAnnTarget] = useState('CSE Sem 2 Section A');


  const handlePostAnnouncement = () => {
    if (!annTitle.trim() || !annContent.trim()) {
      Alert.alert('Incomplete Fields', 'Please enter announcement title and details.');
      return;
    }

    createAnnouncement({
      title: annTitle,
      content: annContent,
      authorName: teacher.name,
      authorRole: teacher.designation,
      targetAudience: annTarget,
      isUrgent: true,
      category: 'Class Update',
    });

    setIsAnnouncementModalOpen(false);
    setAnnTitle('');
    setAnnContent('');
    Alert.alert('Announcement Broadcasted 📢', 'Students in the targeted section will receive instant push notifications.');
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 32: Metric Summary Cards */}
        <View style={styles.metricsRow}>
          <Card style={styles.metricCard}>
            <View style={[styles.metricIconCircle, { backgroundColor: colors.primaryTint }]}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.metricValue}>3</Text>
            <Text style={styles.metricLabel}>{"Today's Classes"}</Text>
          </Card>

          <Card style={styles.metricCard}>
            <View style={[styles.metricIconCircle, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="clipboard-outline" size={20} color={colors.warning} />
            </View>
            <Text style={[styles.metricValue, { color: colors.warningText }]}>18</Text>
            <Text style={styles.metricLabel}>Pending Reviews</Text>
          </Card>

          <Card style={styles.metricCard}>
            <View style={[styles.metricIconCircle, { backgroundColor: colors.secondaryTint }]}>
              <Ionicons name="document-text-outline" size={20} color={colors.secondary} />
            </View>
            <Text style={styles.metricValue}>4</Text>
            <Text style={styles.metricLabel}>Active Tasks</Text>
          </Card>
        </View>

        {/* Section 43: Quick Actions (Contextual for Teacher) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Faculty Quick Actions</Text>
          <Text style={styles.sectionSubtitle}>Manage academic workflow</Text>
        </View>

        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onNavigateToTab(2)} // Resources tab
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: colors.primaryTint }]}>
              <Ionicons name="cloud-upload" size={22} color={colors.primary} />
            </View>
            <Text style={styles.actionBtnText}>Upload Resource</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onNavigateToTab(3, { openCreateModal: true })} // Assignments tab
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: colors.purpleLight }]}>
              <Ionicons name="add-circle" size={22} color={colors.purple} />
            </View>
            <Text style={styles.actionBtnText}>Create Assignment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onNavigateToTab(3)} // Assignments tab
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="checkbox" size={22} color={colors.warning} />
            </View>
            <Text style={styles.actionBtnText}>Evaluate Submissions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setIsAnnouncementModalOpen(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: colors.dangerLight }]}>
              <Ionicons name="megaphone" size={22} color={colors.danger} />
            </View>
            <Text style={styles.actionBtnText}>Post Notice</Text>
          </TouchableOpacity>
        </View>

        {/* Section 32: Today's Teaching Schedule */}
        <View style={[styles.sectionHeaderRow, { marginTop: 16 }]}>
          <View>
            <Text style={styles.sectionTitle}>{"Today's Teaching Schedule"}</Text>
            <Text style={styles.sectionSubtitle}>Assigned lecture & practical slots</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigateToTab(1)}>
            <Text style={styles.viewAllText}>View Classes</Text>
          </TouchableOpacity>
        </View>

        {todayClasses.slice(0, 3).map((cls) => {
          const isLive = cls.status === 'live';
          return (
            <Card key={cls.id} style={styles.scheduleCard} highlightBorder={isLive ? colors.danger : colors.primaryLight}>
              <View style={styles.scheduleHeader}>
                <View style={styles.timePill}>
                  <Ionicons name="time" size={13} color={colors.primary} />
                  <Text style={styles.timePillText}>{cls.startTime} – {cls.endTime}</Text>
                </View>
                <Badge label={isLive ? 'Live Lecture' : 'Upcoming'} variant={isLive ? 'danger' : 'primary'} size="sm" />
              </View>

              <Text style={styles.scheduleSubject}>{cls.subjectName}</Text>

              <View style={styles.scheduleMetaRow}>
                <View style={styles.scheduleMetaItem}>
                  <Ionicons name="people" size={14} color={colors.textSecondary} />
                  <Text style={styles.scheduleMetaText}>Sem 2 • {cls.section}</Text>
                </View>
                <View style={styles.scheduleMetaItem}>
                  <Ionicons name="location" size={14} color={colors.textSecondary} />
                  <Text style={styles.scheduleMetaText}>{cls.room}</Text>
                </View>
              </View>
            </Card>
          );
        })}

        {/* Section 37: Pending Evaluation Alert with AI Similarity Indicator */}
        <View style={[styles.sectionHeaderRow, { marginTop: 16 }]}>
          <View>
            <Text style={styles.sectionTitle}>Submissions Pending Review</Text>
            <Text style={styles.sectionSubtitle}>Review student solutions & integrity check</Text>
          </View>
        </View>

        <Card style={styles.evalAlertCard} highlightBorder={colors.warning}>
          <View style={styles.evalAlertTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.evalAlertTitle}>Python Assignment 03: OOP Modeling</Text>
              <Text style={styles.evalAlertSub}>36 submitted • 18 evaluated • 6 pending review</Text>
            </View>
            <Badge label="Needs Grading" variant="warning" size="sm" />
          </View>

          {/* Similarity flag preview */}
          <View style={styles.similarityNoticeRow}>
            <Ionicons name="shield-outline" size={15} color={colors.danger} />
            <Text style={styles.similarityNoticeText}>
              AI Similarity Alert: 2 submissions show 87% structure match for review.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.reviewSubmissionsBtn}
            onPress={() => onNavigateToTab(3)}
            activeOpacity={0.8}
          >
            <Text style={styles.reviewSubmissionsBtnText}>Open Evaluation Console</Text>
            <Ionicons name="arrow-forward" size={15} color="#FFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </Card>

        {/* Recent Announcements */}
        <View style={[styles.sectionHeaderRow, { marginTop: 16 }]}>
          <Text style={styles.sectionTitle}>Recently Published Notices</Text>
          <TouchableOpacity onPress={() => setIsAnnouncementModalOpen(true)}>
            <Text style={styles.viewAllText}>+ Post New</Text>
          </TouchableOpacity>
        </View>

        {announcements.slice(0, 2).map((anc) => (
          <Card key={anc.id} style={styles.noticeCard}>
            <View style={styles.noticeHeader}>
              <Badge label={anc.targetAudience} variant="primary" size="sm" />
              <Text style={styles.noticeDate}>{anc.date}</Text>
            </View>
            <Text style={styles.noticeTitle}>{anc.title}</Text>
            <Text style={styles.noticeContent} numberOfLines={2}>{anc.content}</Text>
          </Card>
        ))}
      </ScrollView>

      {/* Post Announcement Modal (Section 38) */}
      <Modal visible={isAnnouncementModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Publish Announcement</Text>
              <TouchableOpacity onPress={() => setIsAnnouncementModalOpen(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Target Audience / Class</Text>
            <TextInput
              style={styles.input}
              value={annTarget}
              onChangeText={setAnnTarget}
              placeholder="e.g. CSE Sem 2 Section A"
            />

            <Text style={[styles.inputLabel, { marginTop: 10 }]}>Notice Title</Text>
            <TextInput
              style={styles.input}
              value={annTitle}
              onChangeText={setAnnTitle}
              placeholder="e.g. Lab room change or assignment deadline extension"
            />

            <Text style={[styles.inputLabel, { marginTop: 10 }]}>Announcement Details</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={annContent}
              onChangeText={setAnnContent}
              multiline
              numberOfLines={4}
              placeholder="Write the full notice text..."
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsAnnouncementModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalPublishBtn}
                onPress={handlePostAnnouncement}
              >
                <Text style={styles.modalPublishText}>Broadcast Notice</Text>
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
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    marginVertical: 0,
  },
  metricIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  actionBtn: {
    width: '48%',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    alignItems: 'center',
    ...shadows.soft,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  scheduleCard: {
    padding: 14,
    marginBottom: 10,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  timePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  scheduleSubject: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  scheduleMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  scheduleMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  evalAlertCard: {
    padding: 14,
    marginBottom: 12,
  },
  evalAlertTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  evalAlertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  evalAlertSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  similarityNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    padding: 8,
    borderRadius: borderRadius.sm,
    marginBottom: 10,
  },
  similarityNoticeText: {
    fontSize: 11,
    color: colors.dangerText,
    marginLeft: 6,
    flex: 1,
    fontWeight: '600',
  },
  reviewSubmissionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
  },
  reviewSubmissionsBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  noticeCard: {
    padding: 14,
    marginBottom: 10,
  },
  noticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  noticeDate: {
    fontSize: 11,
    color: colors.textMuted,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  noticeContent: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
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
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
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
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
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
  modalPublishBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  modalPublishText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
