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

export const TeacherResourcesScreen: React.FC = () => {
  const { resources, uploadResource, teacher, openResourceViewer } = useApp();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [resTitle, setResTitle] = useState('');
  const [resType, setResType] = useState<'notes' | 'ppt' | 'pyq' | 'video'>('notes');
  const [resDepartment, setResDepartment] = useState('CSE');
  const [resSemester, setResSemester] = useState('2');
  const [resSubject, setResSubject] = useState('Python Programming');
  const [resUnit, setResUnit] = useState('2');
  const [resFormat, setResFormat] = useState('PDF');
  const [resDescription, setResDescription] = useState('');

  const typeOptions: ('notes' | 'ppt' | 'pyq' | 'video')[] = ['notes', 'ppt', 'pyq', 'video'];

  const handleUploadSubmit = () => {
    if (!resTitle.trim()) {
      Alert.alert('Incomplete Title', 'Please enter a title for the academic resource.');
      return;
    }

    uploadResource({
      title: resTitle,
      type: resType,
      format: resFormat,
      fileSize: '4.2 MB',
      unitNumber: parseInt(resUnit, 10) || 1,
      unitTitle: `Unit ${resUnit}: Core Module`,
      subjectId: 'sub_python',
      subjectName: resSubject,
      facultyName: teacher.name,
      description: resDescription || 'Prescribed study reference uploaded by faculty.',
    });

    setIsUploadModalOpen(false);
    setResTitle('');
    setResDescription('');
    Alert.alert(
      'Resource Published! 📚',
      `"${resTitle}" is now cataloged under ${resDepartment} › Sem ${resSemester} › ${resSubject} › Unit ${resUnit} and immediately accessible to students.`
    );
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section with Upload Button */}
        <View style={styles.topSection}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Academic Resource Management</Text>
            <Text style={styles.sectionSubtitle}>
              Strict curriculum categorization (Dept › Sem › Subject › Unit)
            </Text>
          </View>
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => setIsUploadModalOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="cloud-upload" size={16} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={styles.uploadBtnText}>Upload New</Text>
          </TouchableOpacity>
        </View>

        {/* Resources list */}
        {resources.map((res) => (
          <Card key={res.id} style={styles.resourceCard}>
            <View style={styles.resourceHeader}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <Badge label={res.type.toUpperCase()} variant="primary" size="sm" />
                <Badge label={res.format} variant="neutral" size="sm" />
              </View>
              <Text style={styles.uploadDate}>{res.uploadDate}</Text>
            </View>

            <Text style={styles.resTitle}>{res.title}</Text>

            {/* Categorization Breadcrumbs */}
            <View style={styles.breadcrumbBox}>
              <Ionicons name="folder-open-outline" size={13} color={colors.primary} />
              <Text style={styles.breadcrumbText}>
                CSE › Sem 2 › {res.subjectName} › Unit {res.unitNumber}
              </Text>
            </View>

            {res.description && (
              <Text style={styles.resDescription} numberOfLines={2}>
                {res.description}
              </Text>
            )}

            <View style={styles.cardFooter}>
              <Text style={styles.fileSizeText}>File: {res.fileSize || 'Web Link'}</Text>
              <TouchableOpacity
                style={styles.viewResourceBtn}
                onPress={() => openResourceViewer(res)}
                activeOpacity={0.7}
              >
                <Ionicons name="eye-outline" size={14} color={colors.primaryLight} />
                <Text style={styles.viewResourceBtnText}>Inspect File</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Upload Resource Modal (Section 34) */}
      <Modal visible={isUploadModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Academic Resource</Text>
              <TouchableOpacity onPress={() => setIsUploadModalOpen(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 460 }} showsVerticalScrollIndicator={false}>
              {/* Type Selection */}
              <Text style={styles.inputLabel}>Resource Type</Text>
              <View style={styles.typeSelectorRow}>
                {typeOptions.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.typeOption, resType === type && styles.activeTypeOption]}
                    onPress={() => {
                      setResType(type);
                      setResFormat(type === 'notes' ? 'PDF' : type === 'ppt' ? 'PPTX' : type === 'video' ? 'Link' : 'PDF');
                    }}
                  >
                    <Text style={[styles.typeOptionText, resType === type && styles.activeTypeOptionText]}>
                      {type.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Title */}
              <Text style={[styles.inputLabel, { marginTop: 12 }]}>Document / Resource Title</Text>
              <TextInput
                style={styles.input}
                value={resTitle}
                onChangeText={setResTitle}
                placeholder="e.g. Unit 3: File I/O & Exception Handling Slides"
              />

              {/* Strict Categorization Inputs */}
              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[styles.inputLabel, { marginTop: 10 }]}>Department</Text>
                  <TextInput
                    style={styles.input}
                    value={resDepartment}
                    onChangeText={setResDepartment}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { marginTop: 10 }]}>Semester</Text>
                  <TextInput
                    style={styles.input}
                    value={resSemester}
                    onChangeText={setResSemester}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={{ flex: 2, marginRight: 8 }}>
                  <Text style={[styles.inputLabel, { marginTop: 10 }]}>Subject</Text>
                  <TextInput
                    style={styles.input}
                    value={resSubject}
                    onChangeText={setResSubject}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.inputLabel, { marginTop: 10 }]}>Unit No.</Text>
                  <TextInput
                    style={styles.input}
                    value={resUnit}
                    onChangeText={setResUnit}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <Text style={[styles.inputLabel, { marginTop: 10 }]}>Description / Faculty Remarks</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={resDescription}
                onChangeText={setResDescription}
                multiline
                numberOfLines={3}
                placeholder="Add overview or key exam pointers for students..."
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsUploadModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleUploadSubmit}
              >
                <Text style={styles.modalConfirmText}>Publish Material</Text>
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
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  uploadBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  resourceCard: {
    padding: 14,
    marginBottom: 12,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadDate: {
    fontSize: 11,
    color: colors.textMuted,
  },
  resTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  breadcrumbBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  breadcrumbText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 4,
  },
  resDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  fileSizeText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  viewResourceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewResourceBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryLight,
    marginLeft: 4,
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
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 6,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
    backgroundColor: colors.cardBgSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeTypeOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeOptionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  activeTypeOptionText: {
    color: '#FFF',
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
});
