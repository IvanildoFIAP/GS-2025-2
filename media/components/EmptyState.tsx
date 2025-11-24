import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'document-text-outline',
  title,
  subtitle
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color="#CCC" />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

