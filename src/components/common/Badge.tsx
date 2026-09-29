import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../../theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', size = 'sm' }) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success':
        return { bg: colors.successLight, text: colors.successText };
      case 'warning':
        return { bg: colors.warningLight, text: colors.warningText };
      case 'danger':
        return { bg: colors.dangerLight, text: colors.dangerText };
      case 'primary':
        return { bg: colors.primaryTint, text: colors.primaryLight };
      case 'info':
        return { bg: colors.infoLight, text: colors.infoText };
      case 'purple':
        return { bg: colors.purpleLight, text: colors.purpleText };
      default:
        return { bg: colors.cardBgSubtle, text: colors.textSecondary };
    }
  };

  const { bg, text } = getBadgeStyle();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg, paddingHorizontal: isSm ? 8 : 12, paddingVertical: isSm ? 3 : 5 },
      ]}
    >
      <Text style={[styles.text, { color: text, fontSize: isSm ? 11 : 13 }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
