import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../../theme';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = colors.primaryLight,
  height = 7,
  showLabel = false,
  label,
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <View style={styles.container}>
      {(showLabel || label) && (
        <View style={styles.labelRow}>
          {label ? <Text style={styles.label}>{label}</Text> : null}
          {showLabel ? <Text style={styles.percentText}>{clamped}%</Text> : null}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clamped}%`,
              backgroundColor: color,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  percentText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  track: {
    width: '100%',
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: borderRadius.full,
  },
});
