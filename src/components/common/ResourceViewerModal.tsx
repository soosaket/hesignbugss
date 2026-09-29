import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import { Badge } from './Badge';

export const ResourceViewerModal: React.FC = () => {
  const {
    selectedResourceForView,
    closeResourceViewer,
    toggleBookmark,
    toggleResourceCompleted,
  } = useApp();

  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  if (!selectedResourceForView) return null;

  const res = selectedResourceForView;
  const isVideo = res.type === 'video';

  const handleDownload = () => {
    setDownloadProgress(20);
    setTimeout(() => setDownloadProgress(60), 300);
    setTimeout(() => {
      setDownloadProgress(100);
      setTimeout(() => setDownloadProgress(null), 1200);
    }, 600);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${res.title} from GECM Academic Portal (${res.subjectName})`,
      });
    } catch (e) {
      console.log('Share error:', e);
    }
  };

  return (
    <Modal
      visible={!!selectedResourceForView}
      animationType="slide"
      onRequestClose={closeResourceViewer}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={closeResourceViewer} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {res.title}
            </Text>
            <Text style={styles.headerSubtitle}>{res.subjectName}</Text>
          </View>
          <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
            <Ionicons name="share-social-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Action Controls Bar */}
        <View style={styles.controlsBar}>
          <TouchableOpacity
            style={[styles.controlBtn, res.bookmarked && styles.activeControlBtn]}
            onPress={() => toggleBookmark(res.id)}
          >
            <Ionicons
              name={res.bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={res.bookmarked ? colors.primaryLight : colors.textSecondary}
            />
            <Text
              style={[
                styles.controlBtnText,
                res.bookmarked && { color: colors.primaryLight, fontWeight: '700' },
              ]}
            >
              {res.bookmarked ? 'Saved' : 'Bookmark'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, res.completed && styles.activeCompletedBtn]}
            onPress={() => toggleResourceCompleted(res.id)}
          >
            <Ionicons
              name={res.completed ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={18}
              color={res.completed ? colors.success : colors.textSecondary}
            />
            <Text
              style={[
                styles.controlBtnText,
                res.completed && { color: colors.successText, fontWeight: '700' },
              ]}
            >
              {res.completed ? 'Completed' : 'Mark Done'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, downloadProgress !== null && styles.downloadingBtn]}
            onPress={handleDownload}
            disabled={downloadProgress !== null}
          >
            <Ionicons
              name={downloadProgress === 100 ? 'checkmark' : 'download-outline'}
              size={18}
              color={downloadProgress === 100 ? colors.success : colors.textSecondary}
            />
            <Text style={styles.controlBtnText}>
              {downloadProgress === null
                ? res.fileSize || 'Save'
                : downloadProgress === 100
                ? 'Downloaded'
                : `${downloadProgress}%`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Viewer Body */}
        <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
          {/* Metadata Card */}
          <View style={styles.metaCard}>
            <View style={styles.badgeRow}>
              <Badge
                label={res.type.toUpperCase()}
                variant={res.type === 'pyq' ? 'warning' : res.type === 'video' ? 'purple' : 'primary'}
                size="sm"
              />
              <Badge label={res.format} variant="neutral" size="sm" />
              {res.frequentlyRepeated && (
                <Badge label="★ High Repeat Rate" variant="danger" size="sm" />
              )}
            </View>

            <Text style={styles.resTitle}>{res.title}</Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Unit / Module</Text>
                <Text style={styles.infoValue}>Unit {res.unitNumber}: {res.unitTitle}</Text>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Uploaded By</Text>
                <Text style={styles.infoValue}>{res.facultyName}</Text>
              </View>
              {res.year && (
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Exam Year & Term</Text>
                  <Text style={styles.infoValue}>{res.year} ({res.examType})</Text>
                </View>
              )}
              {res.duration && (
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Duration / Channel</Text>
                  <Text style={styles.infoValue}>{res.duration} • {res.channel}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Document Preview Simulation */}
          <View style={styles.previewContainer}>
            <View style={styles.previewHeader}>
              <Ionicons
                name={isVideo ? 'videocam' : 'document-text'}
                size={18}
                color={colors.primaryLight}
              />
              <Text style={styles.previewHeaderText}>
                {isVideo ? 'Lecture Video Stream' : 'Academic Document Preview'}
              </Text>
            </View>

            <View style={styles.documentPage}>
              <Text style={styles.pageHeader}>GOVERNMENT ENGINEERING COLLEGE (GECM)</Text>
              <Text style={styles.pageSubHeader}>DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING</Text>
              <View style={styles.divider} />

              <Text style={styles.docHeading}>{res.title}</Text>

              <Text style={styles.docParagraph}>
                {res.description ||
                  `This academic material is prescribed under the B.Tech CSE Semester 2 curriculum for ${res.subjectName}. It covers all essential theoretical principles, code implementations, and exam-oriented problem formulations.`}
              </Text>

              <View style={styles.codeSnippetBlock}>
                <Text style={styles.codeTitle}>Sample Demonstration Snippet:</Text>
                <Text style={styles.codeText}>
                  {`# Key Formulation Example\nclass ModelRepresentation:\n    def __init__(self, key: str, value: any):\n        self._key = key\n        self._value = value\n        \n    def serialize(self) -> dict:\n        return {"item": self._key, "payload": self._value}`}
                </Text>
              </View>

              <Text style={styles.docParagraph}>
                Students are advised to review the end-of-chapter practice problems and compare with Previous Year Questions (PYQs) archived in the Exam cell repository.
              </Text>

              <View style={styles.examNoteBox}>
                <Ionicons name="information-circle" size={18} color={colors.warningText} />
                <Text style={styles.examNoteText}>
                  Faculty Exam Tip: Concepts from this unit consistently account for 18–22% of total marks in the upcoming Mid-Semester examination.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconBtn: {
    padding: 6,
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  controlsBar: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    justifyContent: 'space-around',
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardBgSubtle,
  },
  activeControlBtn: {
    backgroundColor: colors.primaryTint,
  },
  activeCompletedBtn: {
    backgroundColor: colors.successLight,
  },
  downloadingBtn: {
    backgroundColor: colors.infoLight,
  },
  controlBtnText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: '600',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  metaCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    ...shadows.soft,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  resTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 14,
  },
  infoGrid: {
    backgroundColor: colors.cardBgSubtle,
    borderRadius: borderRadius.md,
    padding: 12,
    gap: 8,
  },
  infoCol: {
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: 1,
  },
  previewContainer: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgSubtle,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  previewHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  documentPage: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  pageHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  pageSubHeader: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  divider: {
    height: 1.5,
    backgroundColor: colors.primary,
    marginBottom: 14,
  },
  docHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  docParagraph: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  codeSnippetBlock: {
    backgroundColor: '#0F172A',
    borderRadius: borderRadius.md,
    padding: 12,
    marginVertical: 12,
  },
  codeTitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 6,
    fontWeight: '600',
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#38BDF8',
    lineHeight: 18,
  },
  examNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.warningLight,
    padding: 12,
    borderRadius: borderRadius.md,
    marginTop: 8,
  },
  examNoteText: {
    fontSize: 12,
    color: colors.warningText,
    marginLeft: 8,
    flex: 1,
    lineHeight: 17,
  },
});
