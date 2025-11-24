import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'status' | 'urgency';
  status?: 'open' | 'closed' | 'cancelled';
  urgencyLevel?: number;
  style?: ViewStyle;
  fontSize?: number;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  status,
  urgencyLevel,
  style,
  fontSize
}) => {
  const getBackgroundColor = () => {
    if (variant === 'status') {
      if (status === 'open') return '#E3F2FD';
      if (status === 'cancelled') return '#FFEBEE';
      return '#F5F5F5';
    }
    if (variant === 'urgency' && urgencyLevel !== undefined) {
      if (urgencyLevel >= 4) return '#D32F2F';
      if (urgencyLevel === 3) return '#FBC02D';
      return '#388E3C';
    }
    return '#EEE';
  };

  const getTextColor = () => {
    if (variant === 'status') {
      if (status === 'open') return '#1976D2';
      if (status === 'cancelled') return '#C62828';
      return '#666';
    }
    if (variant === 'urgency') {
      return '#FFF';
    }
    return '#555';
  };

  return (
    <View style={[styles.badge, { backgroundColor: getBackgroundColor() }, style]}>
      <Text style={[styles.badgeText, { color: getTextColor(), fontSize: fontSize || 10 }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

