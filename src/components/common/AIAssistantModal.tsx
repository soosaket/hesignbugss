import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import { mockAIKnowledgeBase } from '../../data/mockData';
import { AIMessage } from '../../types';

export const AIAssistantModal: React.FC = () => {
  const { isAIAssistantOpen, closeAIAssistant, student } = useApp();

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'ai_welcome',
      sender: 'assistant',
      text: `Hello ${student.name.split(' ')[0]}! I'm your College Academic AI Assistant. I can explain complex syllabus units, summarize uploaded lecture notes, generate practice MCQs, pull Previous Year Questions, or draft an exam revision schedule. What would you like help with?`,
      timestamp: 'Just now',
      sourceReference: 'GECM B.Tech CSE Curriculum Grounded',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const msgCounter = useRef(100);
  const flatListRef = useRef<FlatList>(null);

  const quickPrompts = [
    'Explain Unit 2 in simple language',
    'Summarize this PDF',
    'Generate 10 MCQs from this chapter',
    'What are the important topics in this unit?',
    'Give me questions from previous years',
    'Create a 7-day study plan',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    msgCounter.current += 1;
    const userMsg: AIMessage = {
      id: `usr_${msgCounter.current}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Formulate response grounded in college mock knowledge
    setTimeout(() => {
      let reply = '';
      let sourceRef = 'Faculty Verified Material';

      const lower = text.toLowerCase();
      if (lower.includes('unit 2') || lower.includes('simple language') || lower.includes('oop')) {
        reply = mockAIKnowledgeBase.unit2;
        sourceRef = 'CS201 Python Unit 2 Lecture Notes (Dr. R. Sharma)';
      } else if (lower.includes('summarize') || lower.includes('pdf') || lower.includes('notes')) {
        reply = mockAIKnowledgeBase.summary;
        sourceRef = 'CS201 OOP Complete Guide.pdf';
      } else if (lower.includes('mcq') || lower.includes('quiz') || lower.includes('practice')) {
        reply = mockAIKnowledgeBase.mcq;
        sourceRef = 'Exam Cell Academic Question Bank 2026';
      } else if (lower.includes('previous year') || lower.includes('pyq') || lower.includes('question')) {
        reply = mockAIKnowledgeBase.pyq;
        sourceRef = '2024-2025 Mid-Sem & End-Sem Archives';
      } else if (lower.includes('7-day') || lower.includes('study plan') || lower.includes('schedule')) {
        reply = mockAIKnowledgeBase.plan;
        sourceRef = 'Academic Calendar & Mid-Sem Syllabus Weightage';
      } else {
        reply = `Based on your B.Tech CSE Semester 2 curriculum for ${text}:\n\n• Key Concept: Focus on the theoretical definitions and standard algorithmic implementation in Python.\n• Lab Correlation: Practical exercise 4 directly examines this concept.\n• Recommendation: Review the Unit 2 slides uploaded yesterday by Dr. Rajiv Sharma before the upcoming mid-sem exam.`;
        sourceRef = 'GECM CSE Syllabus Repository';
      }

      msgCounter.current += 1;
      const assistantMsg: AIMessage = {
        id: `ai_${msgCounter.current}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Just now',
        sourceReference: sourceRef,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  return (
    <Modal visible={isAIAssistantOpen} animationType="slide" onRequestClose={closeAIAssistant}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.sparkleIcon}>
              <Ionicons name="sparkles" size={18} color="#FFF" />
            </View>
            <View>
              <Text style={styles.title}>AI Study Assistant</Text>
              <Text style={styles.subtitle}>Grounded in College Course Material</Text>
            </View>
          </View>
          <TouchableOpacity onPress={closeAIAssistant} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Quick Suggestion Chips */}
        <View style={styles.promptsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promptsScroll}
          >
            {quickPrompts.map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.promptChip}
                onPress={() => handleSendMessage(prompt)}
                activeOpacity={0.7}
              >
                <Ionicons name="bulb-outline" size={12} color={colors.primaryLight} style={{ marginRight: 4 }} />
                <Text style={styles.promptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          renderItem={({ item }) => {
            const isUser = item.sender === 'user';
            return (
              <View
                style={[
                  styles.messageBubble,
                  isUser ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                {!isUser && (
                  <View style={styles.assistantBadgeRow}>
                    <Ionicons name="sparkles" size={12} color={colors.primary} />
                    <Text style={styles.assistantBadgeText}>Academic AI</Text>
                    {item.sourceReference && (
                      <View style={styles.sourceTag}>
                        <Ionicons name="library" size={10} color={colors.secondary} />
                        <Text style={styles.sourceText} numberOfLines={1}>
                          {item.sourceReference}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
                <Text
                  style={[
                    styles.messageText,
                    isUser ? styles.userText : styles.assistantText,
                  ]}
                >
                  {item.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    isUser ? styles.userTime : styles.assistantTime,
                  ]}
                >
                  {item.timestamp}
                </Text>
              </View>
            );
          }}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingContainer}>
                <Ionicons name="sparkles" size={14} color={colors.primaryLight} />
                <Text style={styles.typingText}>Searching course notes & syllabus...</Text>
              </View>
            ) : null
          }
        />

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Ask about syllabus, notes, PYQs, exams..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSendMessage()}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.disabledSendButton,
            ]}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sparkleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  closeBtn: {
    padding: 6,
  },
  promptsContainer: {
    backgroundColor: colors.cardBg,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  promptsScroll: {
    paddingHorizontal: 14,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.primaryLight + '30',
  },
  promptText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 24,
  },
  messageBubble: {
    borderRadius: borderRadius.lg,
    padding: 14,
    marginBottom: 12,
    maxWidth: '88%',
    ...shadows.soft,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  assistantBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  assistantBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4,
    marginRight: 8,
  },
  sourceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryTint,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    maxWidth: 200,
  },
  sourceText: {
    fontSize: 10,
    color: colors.secondary,
    fontWeight: '600',
    marginLeft: 3,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#FFF',
  },
  assistantText: {
    color: colors.textPrimary,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  userTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  assistantTime: {
    color: colors.textMuted,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.cardBgSubtle,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  typingText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
    fontStyle: 'italic',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.cardBgSubtle,
    borderRadius: borderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  disabledSendButton: {
    backgroundColor: colors.borderDark,
  },
});
