import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius } from '../../theme';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { EmptyState } from '../../components/common/EmptyState';
import { Subject } from '../../types';

interface StudentAcademicScreenProps {
  initialSubTab?: string;
}

export const StudentAcademicScreen: React.FC<StudentAcademicScreenProps> = ({ initialSubTab }) => {
  const {
    subjects,
    resources,
    upcomingExams,
    assignments,
    toggleTopicCompletion,
    toggleBookmark,
    openResourceViewer,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(initialSubTab || 'subjects');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<{ [unitNum: number]: boolean }>({ 1: true, 2: true });
  const [selectedPyqYear, setSelectedPyqYear] = useState<number | 'all'>('all');
  const [resourceSearch, setResourceSearch] = useState('');

  const navigationTabs = [
    { key: 'subjects', label: 'Subjects' },
    { key: 'syllabus', label: 'Syllabus' },
    { key: 'notes', label: 'Notes & PPTs' },
    { key: 'pyqs', label: 'PYQs' },
    { key: 'videos', label: 'Video Lectures' },
    { key: 'exams', label: 'Exams' },
    { key: 'deadlines', label: 'Deadlines' },
    { key: 'bookmarks', label: 'Bookmarks' },
  ];

  const toggleUnitExpand = (unitNumber: number) => {
    setExpandedUnits((prev) => ({ ...prev, [unitNumber]: !prev[unitNumber] }));
  };

  // Filtered resources for Notes & PPTs tab
  const notesAndPpts = resources.filter(
    (r) =>
      (r.type === 'notes' || r.type === 'ppt') &&
      (!resourceSearch ||
        r.title.toLowerCase().includes(resourceSearch.toLowerCase()) ||
        r.subjectName.toLowerCase().includes(resourceSearch.toLowerCase()))
  );

  // Filtered PYQs
  const pyqs = resources.filter(
    (r) =>
      r.type === 'pyq' &&
      (selectedPyqYear === 'all' || r.year === selectedPyqYear) &&
      (!resourceSearch || r.title.toLowerCase().includes(resourceSearch.toLowerCase()))
  );

  // Filtered Suggested Videos
  const videoLectures = resources.filter((r) => r.type === 'video');

  // Bookmarked items
  const bookmarkedItems = resources.filter((r) => r.bookmarked);

  // Render Subject List (Section 10)
  const renderSubjectsView = () => {
    if (selectedSubject) {
      // Section 11: Dedicated Subject Detail Page
      return (
        <View style={styles.subjectDetailContainer}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setSelectedSubject(null)}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color={colors.primary} />
            <Text style={styles.backBtnText}>All Subjects</Text>
          </TouchableOpacity>

          {/* Subject Overview Card */}
          <Card style={styles.subjectOverviewCard}>
            <View style={styles.overviewTop}>
              <View>
                <Text style={styles.overviewCode}>{selectedSubject.code}</Text>
                <Text style={styles.overviewTitle}>{selectedSubject.name}</Text>
              </View>
              <Badge label={`${selectedSubject.credits} Credits`} variant="primary" size="md" />
            </View>

            <View style={styles.overviewMetaRow}>
              <View style={styles.overviewMetaItem}>
                <Ionicons name="person" size={13} color={colors.textSecondary} />
                <Text style={styles.overviewMetaText}>{selectedSubject.facultyName}</Text>
              </View>
              <View style={styles.overviewMetaItem}>
                <Ionicons name="time" size={13} color={colors.textSecondary} />
                <Text style={styles.overviewMetaText}>{selectedSubject.schedule}</Text>
              </View>
            </View>

            <View style={styles.progressBarSection}>
              <ProgressBar
                progress={selectedSubject.progress}
                color={selectedSubject.color}
                showLabel
                label="Course Syllabus Completion"
              />
            </View>
          </Card>

          {/* Units / Modules in Subject */}
          <Text style={styles.subSectionTitle}>Modules & Unit Checklist</Text>
          {selectedSubject.modules.map((mod) => {
            const isExpanded = !!expandedUnits[mod.unitNumber];
            return (
              <Card key={mod.unitNumber} style={styles.moduleCard}>
                <TouchableOpacity
                  style={styles.moduleHeader}
                  onPress={() => toggleUnitExpand(mod.unitNumber)}
                  activeOpacity={0.7}
                >
                  <View style={styles.moduleHeaderLeft}>
                    <View style={styles.unitPill}>
                      <Text style={styles.unitPillText}>Unit {mod.unitNumber}</Text>
                    </View>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={styles.moduleTitle}>{mod.title}</Text>
                      <Text style={styles.moduleProgressSub}>{mod.progress}% topics covered</Text>
                    </View>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.topicsContainer}>
                    {mod.topics.map((topic) => (
                      <TouchableOpacity
                        key={topic.id}
                        style={styles.topicRow}
                        onPress={() =>
                          toggleTopicCompletion(selectedSubject.id, mod.unitNumber, topic.id)
                        }
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={topic.completed ? 'checkbox' : 'square-outline'}
                          size={20}
                          color={topic.completed ? colors.success : colors.textMuted}
                        />
                        <Text
                          style={[
                            styles.topicTitle,
                            topic.completed && styles.topicCompletedTitle,
                          ]}
                        >
                          {topic.title}
                        </Text>
                      </TouchableOpacity>
                    ))}

                    {/* Quick Resources for this unit */}
                    <View style={styles.unitActionsRow}>
                      <TouchableOpacity
                        style={styles.unitActionChip}
                        onPress={() => {
                          const note = resources.find(
                            (r) => r.subjectId === selectedSubject.id && r.unitNumber === mod.unitNumber
                          );
                          if (note) openResourceViewer(note);
                        }}
                      >
                        <Ionicons name="document-text" size={13} color={colors.primaryLight} />
                        <Text style={styles.unitActionText}>Unit Notes</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.unitActionChip}
                        onPress={() => {
                          const pyq = resources.find(
                            (r) => r.subjectId === selectedSubject.id && r.type === 'pyq'
                          );
                          if (pyq) openResourceViewer(pyq);
                        }}
                      >
                        <Ionicons name="help-circle" size={13} color={colors.warning} />
                        <Text style={styles.unitActionText}>PYQ Bank</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Card>
            );
          })}
        </View>
      );
    }

    // Default: List of all current semester subjects
    return (
      <View>
        <View style={styles.hierarchyBanner}>
          <Ionicons name="git-network-outline" size={15} color={colors.primary} />
          <Text style={styles.hierarchyText}>B.Tech CSE › Semester 2 › Course Modules</Text>
        </View>

        {subjects.map((sub) => (
          <Card key={sub.id} style={styles.subjectCard}>
            <View style={styles.subjectHeader}>
              <View style={[styles.codeBadge, { backgroundColor: sub.color + '15' }]}>
                <Text style={[styles.codeBadgeText, { color: sub.color }]}>{sub.code}</Text>
              </View>
              <Badge label={`${sub.resourcesCount} Resources`} variant="neutral" size="sm" />
            </View>

            <Text style={styles.subjectCardTitle}>{sub.name}</Text>

            <View style={styles.subjectMetaRow}>
              <Ionicons name="person-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.subjectMetaText}>Faculty: {sub.facultyName}</Text>
            </View>

            <View style={styles.subjectProgressBox}>
              <ProgressBar progress={sub.progress} color={sub.color} showLabel label="Syllabus" />
            </View>

            <TouchableOpacity
              style={[styles.openSubjectBtn, { backgroundColor: sub.color }]}
              onPress={() => setSelectedSubject(sub)}
              activeOpacity={0.8}
            >
              <Text style={styles.openSubjectBtnText}>Open Subject</Text>
              <Ionicons name="arrow-forward" size={15} color="#FFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </Card>
        ))}
      </View>
    );
  };

  // Render Section 12: Dedicated Syllabus Tracker
  const renderSyllabusView = () => {
    return (
      <View>
        <Text style={styles.subSectionTitle}>Interactive Syllabus & Learning Goals</Text>
        <Text style={styles.subSectionDesc}>
          Mark topics as completed as you study to automatically calculate module mastery.
        </Text>

        {subjects.map((sub) => (
          <Card key={sub.id} style={{ marginBottom: 12 }}>
            <View style={styles.syllabusSubjectHeader}>
              <View>
                <Text style={styles.syllabusSubCode}>{sub.code}</Text>
                <Text style={styles.syllabusSubName}>{sub.name}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.overallPercentText}>{sub.progress}%</Text>
                <Text style={styles.overallPercentLabel}>Completed</Text>
              </View>
            </View>

            <ProgressBar progress={sub.progress} color={sub.color} height={6} />

            <View style={{ marginTop: 12 }}>
              {sub.modules.map((mod) => (
                <View key={mod.unitNumber} style={styles.syllabusUnitSection}>
                  <Text style={styles.syllabusUnitTitle}>Unit {mod.unitNumber}: {mod.title}</Text>
                  {mod.topics.map((top) => (
                    <TouchableOpacity
                      key={top.id}
                      style={styles.syllabusTopicRow}
                      onPress={() => toggleTopicCompletion(sub.id, mod.unitNumber, top.id)}
                    >
                      <Ionicons
                        name={top.completed ? 'checkmark-circle' : 'ellipse-outline'}
                        size={18}
                        color={top.completed ? colors.success : colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.syllabusTopicText,
                          top.completed && styles.topicCompletedText,
                        ]}
                      >
                        {top.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </Card>
        ))}
      </View>
    );
  };

  // Render Section 13: Notes & PPTs
  const renderNotesView = () => {
    return (
      <View>
        <View style={styles.searchFilterBox}>
          <Ionicons name="search" size={16} color={colors.textSecondary} />
          <TextInput
            style={styles.filterInput}
            placeholder="Search notes, PPTs, or lecture handouts..."
            placeholderTextColor={colors.textMuted}
            value={resourceSearch}
            onChangeText={setResourceSearch}
          />
        </View>

        {notesAndPpts.length === 0 ? (
          <EmptyState
            icon="document-text-outline"
            title="No notes found"
            description="Try changing your search terms or filter."
          />
        ) : (
          notesAndPpts.map((res) => (
            <Card key={res.id} style={styles.resourceCard}>
              <View style={styles.resourceCardTop}>
                <Badge
                  label={res.format}
                  variant={res.format === 'PDF' ? 'danger' : 'warning'}
                  size="sm"
                />
                <TouchableOpacity
                  onPress={() => toggleBookmark(res.id)}
                  style={{ padding: 4 }}
                >
                  <Ionicons
                    name={res.bookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    color={res.bookmarked ? colors.primaryLight : colors.textMuted}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.resourceCardTitle}>{res.title}</Text>
              <Text style={styles.resourceCardSub}>
                {res.subjectName} • Unit {res.unitNumber} ({res.fileSize})
              </Text>

              <View style={styles.resourceCardFooter}>
                <Text style={styles.resourceAuthor}>By {res.facultyName}</Text>
                <TouchableOpacity
                  style={styles.previewBtn}
                  onPress={() => openResourceViewer(res)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="eye-outline" size={14} color={colors.primaryLight} />
                  <Text style={styles.previewBtnText}>Read / Preview</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}
      </View>
    );
  };

  // Render Section 14: PYQ Repository
  const renderPyqsView = () => {
    const years = ['all', 2025, 2024, 2023, 2022] as const;

    return (
      <View>
        <Text style={styles.subSectionTitle}>Previous Year Exam Question Papers</Text>
        <Text style={styles.subSectionDesc}>
          Official GECM examination papers with repeated question tags.
        </Text>

        {/* Year Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.yearsScroll}>
          {years.map((yr) => (
            <TouchableOpacity
              key={String(yr)}
              style={[
                styles.yearChip,
                selectedPyqYear === yr && styles.activeYearChip,
              ]}
              onPress={() => setSelectedPyqYear(yr)}
            >
              <Text
                style={[
                  styles.yearChipText,
                  selectedPyqYear === yr && styles.activeYearChipText,
                ]}
              >
                {yr === 'all' ? 'All Years' : yr}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {pyqs.map((res) => (
          <Card key={res.id} style={styles.resourceCard}>
            <View style={styles.resourceCardTop}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <Badge label={`${res.year} ${res.examType}`} variant="warning" size="sm" />
                {res.frequentlyRepeated && (
                  <Badge label="★ Repeated Questions" variant="danger" size="sm" />
                )}
              </View>
              <TouchableOpacity onPress={() => toggleBookmark(res.id)}>
                <Ionicons
                  name={res.bookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={res.bookmarked ? colors.primaryLight : colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.resourceCardTitle}>{res.title}</Text>
            <Text style={styles.resourceCardSub}>
              {res.subjectName} • {res.fileSize}
            </Text>

            {res.description && (
              <View style={styles.pyqHintBox}>
                <Ionicons name="sparkles" size={13} color={colors.warning} />
                <Text style={styles.pyqHintText}>{res.description}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.previewBtnPrimary}
              onPress={() => openResourceViewer(res)}
              activeOpacity={0.8}
            >
              <Ionicons name="document-text-outline" size={15} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.previewBtnPrimaryText}>Preview Paper & Solutions</Text>
            </TouchableOpacity>
          </Card>
        ))}
      </View>
    );
  };

  // Render Section 15: Suggested YouTube Lectures
  const renderVideosView = () => {
    return (
      <View>
        <Text style={styles.subSectionTitle}>Curated YouTube Lectures</Text>
        <Text style={styles.subSectionDesc}>
          Faculty-recommended video lessons matched to syllabus units.
        </Text>

        {videoLectures.map((vid) => (
          <Card key={vid.id} style={styles.videoCard}>
            {vid.thumbnail && (
              <Image source={{ uri: vid.thumbnail }} style={styles.videoThumbnail} />
            )}
            <View style={styles.videoCardBody}>
              <View style={styles.videoMetaRow}>
                <Badge label={vid.duration || 'Video'} variant="purple" size="sm" />
                <Text style={styles.channelName}>{vid.channel}</Text>
              </View>
              <Text style={styles.videoTitle}>{vid.title}</Text>
              <Text style={styles.videoDesc}>{vid.description}</Text>

              <TouchableOpacity
                style={styles.watchBtn}
                onPress={() => openResourceViewer(vid)}
                activeOpacity={0.8}
              >
                <Ionicons name="play-circle" size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.watchBtnText}>Watch Lecture</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </View>
    );
  };

  // Render Section 16: Exams
  const renderExamsView = () => {
    return (
      <View>
        <Text style={styles.subSectionTitle}>Upcoming Examinations</Text>
        <Text style={styles.subSectionDesc}>
          Official midterm and endterm timetables & instructions.
        </Text>

        {upcomingExams.map((ex) => (
          <Card key={ex.id} style={styles.examCard} highlightBorder={colors.danger}>
            <View style={styles.examCardHeader}>
              <View>
                <Text style={styles.examSubjectCode}>{ex.subjectCode}</Text>
                <Text style={styles.examSubjectName}>{ex.subjectName}</Text>
              </View>
              <View style={styles.daysBadge}>
                <Text style={styles.daysText}>{ex.remainingDays}</Text>
                <Text style={styles.daysSub}>days remaining</Text>
              </View>
            </View>

            <View style={styles.examInfoGrid}>
              <View style={styles.examInfoItem}>
                <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.examInfoText}>{ex.date}</Text>
              </View>
              <View style={styles.examInfoItem}>
                <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.examInfoText}>{ex.time}</Text>
              </View>
              <View style={styles.examInfoItem}>
                <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.examInfoText}>{ex.room}</Text>
              </View>
            </View>

            <View style={styles.instructionsBox}>
              <Text style={styles.instructionsTitle}>Instructions:</Text>
              {ex.instructions.map((inst, i) => (
                <Text key={i} style={styles.instructionItem}>• {inst}</Text>
              ))}
            </View>
          </Card>
        ))}
      </View>
    );
  };

  // Render Section 17: Deadlines
  const renderDeadlinesView = () => {
    const combinedDeadlines = [
      ...assignments.map((a) => ({
        id: a.id,
        title: a.title,
        type: 'Assignment',
        date: a.deadlineFormatted,
        subject: a.subjectName,
      })),
      ...upcomingExams.map((e) => ({
        id: e.id,
        title: `${e.examName}: ${e.subjectName}`,
        type: 'Exam',
        date: e.date,
        subject: e.subjectName,
      })),
    ];

    return (
      <View>
        <Text style={styles.subSectionTitle}>Unified Academic Deadlines Tracker</Text>
        <Text style={styles.subSectionDesc}>
          One calendar timeline for assignments, examinations, projects, and forms.
        </Text>

        {combinedDeadlines.map((item, idx) => (
          <Card key={idx} style={styles.deadlineTimelineCard}>
            <View style={styles.timelineRow}>
              <View style={styles.timelineDot} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Badge
                    label={item.type}
                    variant={item.type === 'Exam' ? 'danger' : 'primary'}
                    size="sm"
                  />
                  <Text style={styles.deadlineDate}>{item.date}</Text>
                </View>
                <Text style={styles.deadlineCardTitle}>{item.title}</Text>
                <Text style={styles.deadlineSub}>{item.subject}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    );
  };

  // Render Section 30: Bookmarks
  const renderBookmarksView = () => {
    return (
      <View>
        <Text style={styles.subSectionTitle}>My Bookmarks</Text>
        <Text style={styles.subSectionDesc}>
          Quickly return to saved notes, lecture videos, and Previous Year Questions.
        </Text>

        {bookmarkedItems.length === 0 ? (
          <EmptyState
            icon="bookmark-outline"
            title="No bookmarks saved"
            description="Tap the bookmark ribbon on any note, PYQ, or video to access it here anytime."
          />
        ) : (
          bookmarkedItems.map((res) => (
            <Card key={res.id} style={styles.resourceCard}>
              <View style={styles.resourceCardTop}>
                <Badge label={res.type.toUpperCase()} variant="primary" size="sm" />
                <TouchableOpacity onPress={() => toggleBookmark(res.id)}>
                  <Ionicons name="bookmark" size={20} color={colors.primaryLight} />
                </TouchableOpacity>
              </View>
              <Text style={styles.resourceCardTitle}>{res.title}</Text>
              <Text style={styles.resourceCardSub}>
                {res.subjectName} • Unit {res.unitNumber}
              </Text>
              <TouchableOpacity
                style={styles.previewBtn}
                onPress={() => openResourceViewer(res)}
              >
                <Text style={styles.previewBtnText}>Open Saved Item</Text>
              </TouchableOpacity>
            </Card>
          ))
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* Horizontal Sub-Navigation Tab Bar */}
      <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {navigationTabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.navTab, activeTab === tab.key && styles.activeNavTab]}
              onPress={() => {
                setActiveTab(tab.key);
                setSelectedSubject(null);
              }}
            >
              <Text style={[styles.navTabText, activeTab === tab.key && styles.activeNavTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'subjects' && renderSubjectsView()}
        {activeTab === 'syllabus' && renderSyllabusView()}
        {activeTab === 'notes' && renderNotesView()}
        {activeTab === 'pyqs' && renderPyqsView()}
        {activeTab === 'videos' && renderVideosView()}
        {activeTab === 'exams' && renderExamsView()}
        {activeTab === 'deadlines' && renderDeadlinesView()}
        {activeTab === 'bookmarks' && renderBookmarksView()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBarContainer: {
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsScroll: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  navTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.cardBgSubtle,
  },
  activeNavTab: {
    backgroundColor: colors.primary,
  },
  navTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeNavTabText: {
    color: '#FFF',
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  hierarchyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
    padding: 10,
    borderRadius: borderRadius.md,
    marginBottom: 14,
  },
  hierarchyText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 6,
  },
  subjectCard: {
    padding: 16,
    marginBottom: 12,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  codeBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  subjectCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subjectMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  subjectProgressBox: {
    marginVertical: 4,
  },
  openSubjectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    marginTop: 10,
  },
  openSubjectBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  subjectDetailContainer: {
    marginBottom: 20,
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
  subjectOverviewCard: {
    padding: 16,
    marginBottom: 16,
  },
  overviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  overviewCode: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryLight,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  overviewMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBgSubtle,
    padding: 10,
    borderRadius: borderRadius.md,
    marginVertical: 10,
  },
  overviewMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  progressBarSection: {
    marginTop: 6,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subSectionDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  moduleCard: {
    padding: 14,
    marginBottom: 10,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moduleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  unitPill: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginRight: 10,
  },
  unitPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  moduleProgressSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  topicsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginTop: 10,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  topicTitle: {
    fontSize: 13,
    color: colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  topicCompletedTitle: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  unitActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  unitActionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgSubtle,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  unitActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  syllabusSubjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  syllabusSubCode: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryLight,
  },
  syllabusSubName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  overallPercentText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  overallPercentLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  syllabusUnitSection: {
    marginVertical: 6,
  },
  syllabusUnitTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  syllabusTopicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingLeft: 6,
  },
  syllabusTopicText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  topicCompletedText: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  searchFilterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  filterInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: colors.textPrimary,
  },
  resourceCard: {
    padding: 14,
    marginBottom: 10,
  },
  resourceCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  resourceCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  resourceCardSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  resourceCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  resourceAuthor: {
    fontSize: 11,
    color: colors.textMuted,
  },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.md,
  },
  previewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryLight,
    marginLeft: 4,
  },
  yearsScroll: {
    marginBottom: 12,
  },
  yearChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  activeYearChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  yearChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeYearChipText: {
    color: '#FFF',
  },
  pyqHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    padding: 8,
    borderRadius: borderRadius.sm,
    marginBottom: 10,
  },
  pyqHintText: {
    fontSize: 11,
    color: colors.warningText,
    marginLeft: 6,
    flex: 1,
  },
  previewBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
  },
  previewBtnPrimaryText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  videoCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 14,
  },
  videoThumbnail: {
    width: '100%',
    height: 160,
  },
  videoCardBody: {
    padding: 14,
  },
  videoMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  channelName: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  videoDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    marginBottom: 12,
  },
  watchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
  },
  watchBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  examCard: {
    padding: 16,
    marginBottom: 12,
  },
  examCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  examSubjectCode: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.dangerText,
  },
  examSubjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  daysBadge: {
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  daysText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.dangerText,
  },
  daysSub: {
    fontSize: 9,
    color: colors.dangerText,
  },
  examInfoGrid: {
    backgroundColor: colors.cardBgSubtle,
    borderRadius: borderRadius.md,
    padding: 10,
    gap: 6,
    marginBottom: 12,
  },
  examInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  examInfoText: {
    fontSize: 12,
    color: colors.textPrimary,
    marginLeft: 6,
    fontWeight: '500',
  },
  instructionsBox: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  instructionsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  instructionItem: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  deadlineTimelineCard: {
    padding: 14,
    marginBottom: 8,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryLight,
    marginTop: 6,
    marginRight: 12,
  },
  deadlineDate: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  deadlineCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  deadlineSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
