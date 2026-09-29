import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const RoleSwitcherModal: React.FC = () => {
  const { isRoleSwitcherOpen, closeRoleSwitcher, role, setRole, student, teacher } = useApp();

  const handleSelectRole = (newRole: UserRole) => {
    setRole(newRole);
    closeRoleSwitcher();
  };

  return (
    <Modal
      visible={isRoleSwitcherOpen}
      transparent
      animationType="fade"
      onRequestClose={closeRoleSwitcher}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Switch Role / Workspace</Text>
              <Text style={styles.subtitle}>Test student & faculty experiences instantly</Text>
            </View>
            <TouchableOpacity onPress={closeRoleSwitcher} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Student Role Card */}
          <TouchableOpacity
            style={[styles.roleOption, role === 'STUDENT' && styles.selectedOption]}
            onPress={() => handleSelectRole('STUDENT')}
            activeOpacity={0.8}
          >
            <Image source={{ uri: student.avatar }} style={styles.avatar} />
            <View style={styles.roleDetails}>
              <View style={styles.roleTitleRow}>
                <Text style={styles.roleName}>Student Panel</Text>
                {role === 'STUDENT' && (
                  <View style={styles.activeTag}>
                    <Text style={styles.activeTagText}>Active</Text>
                  </View>
                )}
              </View>
              <Text style={styles.personName}>{student.name} ({student.rollNumber})</Text>
              <Text style={styles.roleDesc}>
                {student.course} • Sem {student.semester} • {student.section}
              </Text>
            </View>
            <Ionicons
              name={role === 'STUDENT' ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={role === 'STUDENT' ? colors.primaryLight : colors.textMuted}
            />
          </TouchableOpacity>

          {/* Teacher Role Card */}
          <TouchableOpacity
            style={[styles.roleOption, role === 'TEACHER' && styles.selectedOption]}
            onPress={() => handleSelectRole('TEACHER')}
            activeOpacity={0.8}
          >
            <Image source={{ uri: teacher.avatar }} style={styles.avatar} />
            <View style={styles.roleDetails}>
              <View style={styles.roleTitleRow}>
                <Text style={styles.roleName}>Teacher / Faculty Panel</Text>
                {role === 'TEACHER' && (
                  <View style={styles.activeTag}>
                    <Text style={styles.activeTagText}>Active</Text>
                  </View>
                )}
              </View>
              <Text style={styles.personName}>{teacher.name}</Text>
              <Text style={styles.roleDesc}>
                {teacher.designation} • {teacher.department}
              </Text>
            </View>
            <Ionicons
              name={role === 'TEACHER' ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={role === 'TEACHER' ? colors.primaryLight : colors.textMuted}
            />
          </TouchableOpacity>

          {/* RBAC Extensibility Note */}
          <View style={styles.rbacNotice}>
            <Ionicons name="shield-checkmark" size={16} color={colors.secondary} />
            <Text style={styles.rbacText}>
              RBAC Architecture: Built to support upcoming Admin and Class Representative (CR) roles.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.xl,
    padding: 20,
    width: '100%',
    maxWidth: 420,
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 12,
    backgroundColor: colors.cardBgSubtle,
  },
  selectedOption: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primaryTint,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  roleDetails: {
    flex: 1,
    marginRight: 8,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  activeTag: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  activeTagText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  personName: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: 1,
  },
  roleDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  rbacNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryTint,
    padding: 10,
    borderRadius: borderRadius.md,
    marginTop: 4,
  },
  rbacText: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
});
