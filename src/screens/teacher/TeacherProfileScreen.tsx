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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius } from '../../theme';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Header } from '../../components/common/Header';

export const TeacherProfileScreen: React.FC = () => {
  const { teacher, openRoleSwitcher, logout } = useApp();
  const [submissionAlerts, setSubmissionAlerts] = useState(true);
  const [officeHoursActive, setOfficeHoursActive] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Faculty Session Logout',
      'Do you wish to log out from the GECM Faculty Portal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header showGreeting={false} title="Faculty Profile" subtitle={teacher.facultyId} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Faculty Identity Card */}
        <Card style={styles.idCard} highlightBorder={colors.primary}>
          <View style={styles.idHeader}>
            <Image source={{ uri: teacher.avatar }} style={styles.avatarLarge} />
            <View style={styles.idInfo}>
              <Text style={styles.facultyName}>{teacher.name}</Text>
              <Text style={styles.designation}>{teacher.designation}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.deptBadge}>
                  <Text style={styles.deptBadgeText}>{teacher.department}</Text>
                </View>
                <View style={[styles.deptBadge, { backgroundColor: colors.secondaryTint }]}>
                  <Text style={[styles.deptBadgeText, { color: colors.secondary }]}>
                    {teacher.facultyId}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.officeRoomBox}>
            <Ionicons name="business-outline" size={16} color={colors.primary} />
            <Text style={styles.officeRoomText}>Office: {teacher.officeRoom}</Text>
          </View>
        </Card>

        {/* Assigned Subjects & Course Load */}
        <Text style={styles.sectionTitle}>Course Allocations & Load</Text>
        <Card style={styles.infoCard}>
          {teacher.assignedSubjects.map((sub, index) => (
            <View key={index} style={[styles.subRow, index !== teacher.assignedSubjects.length - 1 && styles.subRowBorder]}>
              <Ionicons name="book" size={16} color={colors.primaryLight} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.subTitle}>{sub}</Text>
                <Text style={styles.subMeta}>Semester 2 & 4 • 4 Credits Each</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Faculty Contact Details */}
        <Text style={styles.sectionTitle}>Official Contact Coordinates</Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Official Email</Text>
            <Text style={styles.infoValue}>{teacher.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Direct Office Phone</Text>
            <Text style={styles.infoValue}>{teacher.phone}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Academic ERP ID</Text>
            <Text style={styles.infoValue}>ERP-FAC-2026-09</Text>
          </View>
        </Card>

        {/* Settings & Controls */}
        <Text style={styles.sectionTitle}>Preferences & Workspace</Text>
        <Card style={styles.settingsCard}>
          {/* Switch to Student Mode */}
          <TouchableOpacity
            style={styles.settingItemRow}
            onPress={openRoleSwitcher}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemLeft}>
              <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.settingItemTitle}>Switch to Student View</Text>
                <Text style={styles.settingItemSub}>Preview student experience & notes</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.primaryLight} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.settingItemTitle}>Instant Submission Alerts</Text>
                <Text style={styles.settingItemSub}>Notify when students hand in tasks</Text>
              </View>
            </View>
            <Switch
              value={submissionAlerts}
              onValueChange={setSubmissionAlerts}
              trackColor={{ false: colors.borderDark, true: colors.primaryLight }}
            />
          </View>

          <View style={styles.settingItemRow}>
            <View style={styles.settingItemLeft}>
              <Ionicons name="time-outline" size={20} color={colors.secondary} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.settingItemTitle}>Office Hours Status</Text>
                <Text style={styles.settingItemSub}>{'Show "Available for Mentoring" in portal'}</Text>
              </View>
            </View>
            <Switch
              value={officeHoursActive}
              onValueChange={setOfficeHoursActive}
              trackColor={{ false: colors.borderDark, true: colors.secondary }}
            />
          </View>

          {/* Logout */}
          <TouchableOpacity
            style={[styles.settingItemRow, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemLeft}>
              <Ionicons name="log-out-outline" size={20} color={colors.danger} />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.settingItemTitle, { color: colors.danger }]}>Sign Out</Text>
                <Text style={styles.settingItemSub}>End active faculty session</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.danger} />
          </TouchableOpacity>
        </Card>
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
  facultyName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  designation: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
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
  officeRoomBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgSubtle,
    borderRadius: borderRadius.md,
    padding: 10,
  },
  officeRoomText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 8,
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
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  subRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
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
});
