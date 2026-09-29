import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Header } from '../../components/common/Header';

export const StudentProfileScreen: React.FC = () => {
  const { student, openRoleSwitcher, logout } = useApp();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Incomplete Fields', 'Please fill in both current and new password.');
      return;
    }
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    Alert.alert('Password Updated', 'Your portal security credentials have been updated.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to end your active session on this device?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header showGreeting={false} title="Student Profile & ID" subtitle={student.rollNumber} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Identity Card */}
        <Card style={styles.idCard} highlightBorder={colors.primary}>
          <View style={styles.idHeader}>
            <Image source={{ uri: student.avatar }} style={styles.avatarLarge} />
            <View style={styles.idInfo}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.rollNumber}>{student.rollNumber}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.deptBadge}>
                  <Text style={styles.deptBadgeText}>{student.course}</Text>
                </View>
                <View style={[styles.deptBadge, { backgroundColor: colors.secondaryTint }]}>
                  <Text style={[styles.deptBadgeText, { color: colors.secondary }]}>
                    Sem {student.semester} ({student.section})
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.barcodePlaceholder}>
            <Ionicons name="barcode-outline" size={32} color={colors.textSecondary} />
            <Text style={styles.barcodeText}>GECM-RFID-24CSE042-VERIFIED</Text>
          </View>
        </Card>

        {/* Section 27: Academic Information */}
        <Text style={styles.sectionTitle}>Academic Enrollment Details</Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Roll / Student ID</Text>
            <Text style={styles.infoValue}>{student.rollNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Department</Text>
            <Text style={styles.infoValue}>{student.department}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Academic Program</Text>
            <Text style={styles.infoValue}>{student.course}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Semester & Section</Text>
            <Text style={styles.infoValue}>Semester {student.semester} • {student.section}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Admission Year</Text>
            <Text style={styles.infoValue}>{student.admissionYear}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Academic Batch</Text>
            <Text style={styles.infoValue}>{student.batch}</Text>
          </View>
        </Card>

        {/* Personal Information */}
        <Text style={styles.sectionTitle}>Personal & Contact Information</Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{student.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{student.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>{student.dob}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Campus Address</Text>
            <Text style={[styles.infoValue, { flex: 1, textAlign: 'right' }]}>{student.address}</Text>
          </View>
        </Card>

        {/* Account & Settings */}
        <Text style={styles.sectionTitle}>Account & Preferences</Text>
        <Card style={styles.settingsCard}>
          {/* Switch Role Quick Action */}
          <TouchableOpacity
            style={styles.settingItemRow}
            onPress={openRoleSwitcher}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemLeft}>
              <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.settingItemTitle}>Switch to Faculty View</Text>
                <Text style={styles.settingItemSub}>Preview Teacher / Evaluator panel</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.primaryLight} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.settingItemTitle}>Push Notifications</Text>
                <Text style={styles.settingItemSub}>Deadlines, notes, and urgent alerts</Text>
              </View>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: colors.borderDark, true: colors.primaryLight }}
            />
          </View>

          <View style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <Ionicons name="mail-outline" size={20} color={colors.secondary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.settingItemTitle}>Email Digests</Text>
                <Text style={styles.settingItemSub}>Weekly performance and fee status</Text>
              </View>
            </View>
            <Switch
              value={emailAlerts}
              onValueChange={setEmailAlerts}
              trackColor={{ false: colors.borderDark, true: colors.secondary }}
            />
          </View>

          <TouchableOpacity
            style={styles.settingItemRow}
            onPress={() => setIsPasswordModalOpen(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemLeft}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.settingItemTitle}>Change Password</Text>
                <Text style={styles.settingItemSub}>Update portal credentials</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItemRow}
            onPress={() => Alert.alert('Help & Support', 'Academic Support Desk:\nhelpdesk@gecm.edu.in\nPhone: +91 7752 245600\nMon–Fri: 9:00 AM – 5:00 PM')}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemLeft}>
              <Ionicons name="help-buoy-outline" size={20} color={colors.info} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.settingItemTitle}>Help & Support</Text>
                <Text style={styles.settingItemSub}>IT cell & academic helpdesk</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            style={[styles.settingItemRow, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemLeft}>
              <Ionicons name="log-out-outline" size={20} color={colors.danger} />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.settingItemTitle, { color: colors.danger }]}>Logout Session</Text>
                <Text style={styles.settingItemSub}>Switch or end session</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.danger} />
          </TouchableOpacity>
        </Card>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal visible={isPasswordModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <Text style={styles.modalSubtitle}>Enter your current and new password below.</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <TextInput
              style={[styles.modalInput, { marginTop: 10 }]}
              placeholder="New Secure Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsPasswordModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleChangePassword}
              >
                <Text style={styles.modalSaveText}>Update</Text>
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
  idCard: {
    padding: 16,
    marginBottom: 16,
  },
  idHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 14,
  },
  idInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  rollNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryLight,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  deptBadge: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  deptBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  barcodePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardBgSubtle,
    borderRadius: borderRadius.md,
    padding: 8,
  },
  barcodeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 8,
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  infoCard: {
    padding: 14,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingsCard: {
    padding: 6,
    marginBottom: 16,
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  settingItemSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    ...shadows.card,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 14,
  },
  modalInput: {
    backgroundColor: colors.cardBgSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  modalActionRow: {
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
  modalSaveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  modalSaveText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
