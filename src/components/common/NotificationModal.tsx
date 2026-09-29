import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';
import { EmptyState } from './EmptyState';

export const NotificationModal: React.FC = () => {
  const {
    isNotificationsOpen,
    closeNotifications,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'assignment', label: 'Assignments' },
    { key: 'notes', label: 'Notes & Material' },
    { key: 'exam', label: 'Exams' },
    { key: 'announcement', label: 'Faculty' },
  ];

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'assignment':
        return { name: 'document-text' as const, color: colors.primaryLight, bg: colors.primaryTint };
      case 'notes':
        return { name: 'book' as const, color: colors.secondary, bg: colors.secondaryTint };
      case 'exam':
        return { name: 'calendar' as const, color: colors.warning, bg: colors.warningLight };
      case 'announcement':
        return { name: 'megaphone' as const, color: colors.purple, bg: colors.purpleLight };
      default:
        return { name: 'notifications' as const, color: colors.info, bg: colors.infoLight };
    }
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => {
    const iconConfig = getCategoryIcon(item.category);

    return (
      <TouchableOpacity
        style={[styles.notificationCard, !item.read && styles.unreadCard]}
        onPress={() => markNotificationRead(item.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconCircle, { backgroundColor: iconConfig.bg }]}>
          <Ionicons name={iconConfig.name} size={18} color={iconConfig.color} />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, !item.read && styles.unreadTitle]} numberOfLines={1}>
              {item.title}
            </Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.cardMessage}>{item.message}</Text>
          <Text style={styles.cardTime}>{item.timestamp}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={isNotificationsOpen}
      animationType="slide"
      transparent
      onRequestClose={closeNotifications}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Notifications</Text>
              <Text style={styles.subtitle}>Academic alerts & updates</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={markAllNotificationsRead}
                style={styles.markAllBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.markAllText}>Mark all read</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeNotifications} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Filter Chips */}
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.filterChip,
                    activeFilter === cat.key && styles.activeFilterChip,
                  ]}
                  onPress={() => setActiveFilter(cat.key)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      activeFilter === cat.key && styles.activeFilterText,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Notification List */}
          <FlatList
            data={filteredNotifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotification}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <EmptyState
                icon="notifications-off-outline"
                title="No new notifications"
                description="You are caught up with all academic updates."
              />
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '85%',
    minHeight: '55%',
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.cardBg,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  markAllText: {
    color: colors.primaryLight,
    fontSize: 13,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 6,
  },
  filterContainer: {
    backgroundColor: colors.cardBg,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.cardBgSubtle,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeFilterText: {
    color: '#FFF',
  },
  listContent: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  unreadCard: {
    backgroundColor: colors.primaryTint + '40',
    borderColor: colors.primaryLight + '50',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryLight,
    marginLeft: 6,
  },
  cardMessage: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 17,
  },
  cardTime: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 6,
  },
});
