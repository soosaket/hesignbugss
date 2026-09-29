import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, borderRadius, shadows } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  highlightBorder?: string;
}

export const Card: React.FC<CardProps> = ({ children, style, highlightBorder }) => {
  return (
    <View
      style={[
        styles.card,
        highlightBorder ? { borderLeftColor: highlightBorder, borderLeftWidth: 4 } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginVertical: 6,
    ...shadows.soft,
  },
});
