import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showGreeting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showGreeting = true,
}) => {
  const {
    role,
    student,
    teacher,
    unreadNotificationCount,
    openNotifications,
    openSearch,
    openRoleSwitcher,
  } = useApp();

  const isStudent = role === 'STUDENT';
  const name = isStudent ? student.name : teacher.name;
  const avatar = isStudent ? student.avatar : teacher.avatar;
  const shortName = isStudent ? student.name.split(' ')[0] : teacher.name.split(' ')[1] || 'Faculty';

  const defaultTitle = isStudent
    ? `${student.course} • Sem ${student.semester} • ${student.section}`
    : `${teacher.designation} • ${teacher.department}`;

  const greeting = isStudent
    ? `Good Morning, ${shortName} 👋`
    : `Good Morning, ${teacher.name.split(' ')[0]} 👋`;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        {/* Left: Avatar & Identity */}
        <View style={styles.profileSection}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.identityDetails}>
            {showGreeting && <Text style={styles.greetingText}>{greeting}</Text>}
            <Text style={styles.nameText} numberOfLines={1}>
              {title || name}
            </Text>
            <Text style={styles.subText} numberOfLines={1}>
              {subtitle || defaultTitle}
            </Text>
          </View>
        </View>

        {/* Right: Actions (Role Pill, Search, Notif Bell) */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.roleButton}
            onPress={openRoleSwitcher}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isStudent ? 'school' : 'briefcase'}
              size={12}
              color={colors.primary}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.roleText}>{isStudent ? 'Student' : 'Faculty'}</Text>
            <Ionicons name="chevron-down" size={12} color={colors.textSecondary} style={{ marginLeft: 2 }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={openSearch} activeOpacity={0.7}>
            <Ionicons name="search" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={openNotifications}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={21} color={colors.textPrimary} />
            {unreadNotificationCount > 0 && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeText}>
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBg,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.soft,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  identityDetails: {
    marginLeft: 10,
    flex: 1,
  },
  greetingText: {
    fontSize: 12,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primaryLight + '30',
    marginRight: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.cardBgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    position: 'relative',
  },
  badgeCount: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
