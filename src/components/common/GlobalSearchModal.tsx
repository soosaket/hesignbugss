import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import { Badge } from './Badge';

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'subject' | 'note' | 'pyq' | 'video' | 'assignment' | 'announcement';
  originalItem: any;
}

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    closeSearch,
    subjects,
    resources,
    assignments,
    announcements,
    openResourceViewer,
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'subject', label: 'Subjects' },
    { key: 'note', label: 'Notes & PPTs' },
    { key: 'pyq', label: 'PYQs' },
    { key: 'assignment', label: 'Assignments' },
  ];

  const searchResults: SearchResultItem[] = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const results: SearchResultItem[] = [];

    // Subjects & Topics
    subjects.forEach((sub) => {
      if (
        sub.name.toLowerCase().includes(q) ||
        sub.code.toLowerCase().includes(q) ||
        sub.facultyName.toLowerCase().includes(q)
      ) {
        results.push({
          id: `search_sub_${sub.id}`,
          title: `${sub.code}: ${sub.name}`,
          subtitle: `Faculty: ${sub.facultyName} • Sem ${sub.semester}`,
          type: 'subject',
          originalItem: sub,
        });
      }

      // Check topics within subject modules
      sub.modules.forEach((mod) => {
        mod.topics.forEach((top) => {
          if (top.title.toLowerCase().includes(q)) {
            results.push({
              id: `search_top_${top.id}`,
              title: top.title,
              subtitle: `${sub.name} • Unit ${mod.unitNumber}: ${mod.title}`,
              type: 'note',
              originalItem: { subject: sub, module: mod, topic: top },
            });
          }
        });
      });
    });

    // Resources (Notes, PPTs, PYQs, Videos)
    resources.forEach((res) => {
      if (
        res.title.toLowerCase().includes(q) ||
        res.subjectName.toLowerCase().includes(q) ||
        (res.description && res.description.toLowerCase().includes(q)) ||
        (res.year && res.year.toString().includes(q))
      ) {
        results.push({
          id: `search_res_${res.id}`,
          title: res.title,
          subtitle: `${res.subjectName} • Unit ${res.unitNumber} (${res.format})`,
          type: res.type === 'pyq' ? 'pyq' : res.type === 'video' ? 'video' : 'note',
          originalItem: res,
        });
      }
    });

    // Assignments
    assignments.forEach((asg) => {
      if (
        asg.title.toLowerCase().includes(q) ||
        asg.subjectName.toLowerCase().includes(q) ||
        asg.instructions.toLowerCase().includes(q)
      ) {
        results.push({
          id: `search_asg_${asg.id}`,
          title: asg.title,
          subtitle: `Due: ${asg.deadlineFormatted} • ${asg.totalMarks} Marks`,
          type: 'assignment',
          originalItem: asg,
        });
      }
    });

    // Announcements
    announcements.forEach((ann) => {
      if (ann.title.toLowerCase().includes(q) || ann.content.toLowerCase().includes(q)) {
        results.push({
          id: `search_ann_${ann.id}`,
          title: ann.title,
          subtitle: `${ann.authorName} • ${ann.date}`,
          type: 'announcement',
          originalItem: ann,
        });
      }
    });

    return results;
  }, [query, subjects, resources, assignments, announcements]);

  const filteredResults = searchResults.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.type === activeCategory;
  });

  const handleItemPress = (item: SearchResultItem) => {
    closeSearch();
    if (item.type === 'note' || item.type === 'pyq' || item.type === 'video') {
      if (item.originalItem.type) {
        openResourceViewer(item.originalItem);
      }
    }
  };

  const getTypeBadge = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'subject':
        return <Badge label="Subject" variant="primary" size="sm" />;
      case 'note':
        return <Badge label="Study Note" variant="info" size="sm" />;
      case 'pyq':
        return <Badge label="PYQ" variant="warning" size="sm" />;
      case 'video':
        return <Badge label="Lecture" variant="purple" size="sm" />;
      case 'assignment':
        return <Badge label="Assignment" variant="danger" size="sm" />;
      case 'announcement':
        return <Badge label="Notice" variant="neutral" size="sm" />;
    }
  };

  return (
    <Modal visible={isSearchOpen} animationType="slide" onRequestClose={closeSearch}>
      <View style={styles.safeArea}>
        {/* Search Input Bar */}
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search subjects, notes, PYQs, assignments..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              autoFocus
              clearButtonMode="while-editing"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={closeSearch} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        {query.trim().length > 0 && (
          <View style={styles.filterBar}>
            {filterTabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.filterChip,
                  activeCategory === tab.key && styles.activeFilterChip,
                ]}
                onPress={() => setActiveCategory(tab.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    activeCategory === tab.key && styles.activeFilterChipText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Results List */}
        <FlatList
          data={filteredResults}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.resultHeader}>
                {getTypeBadge(item.type)}
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </View>
              <Text style={styles.resultTitle}>{item.title}</Text>
              <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name={query ? 'search-outline' : 'book-outline'}
                size={48}
                color={colors.borderDark}
              />
              <Text style={styles.emptyTitle}>
                {query ? 'No matching resources found' : 'Type to search everything'}
              </Text>
              <Text style={styles.emptyDesc}>
                {query
                  ? 'Try searching by topic keyword, subject code, or professor name.'
                  : 'Quick examples: "Inheritance", "Python", "PYQ 2025", "Unit 2", "Lab".'}
              </Text>
            </View>
          }
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgSubtle,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.textPrimary,
  },
  cancelBtn: {
    marginLeft: 12,
    paddingVertical: 6,
  },
  cancelText: {
    color: colors.primaryLight,
    fontSize: 14,
    fontWeight: '600',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    backgroundColor: colors.cardBgSubtle,
    marginRight: 6,
  },
  activeFilterChip: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activeFilterChipText: {
    color: '#FFF',
  },
  listContent: {
    padding: 16,
  },
  resultCard: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 14,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
