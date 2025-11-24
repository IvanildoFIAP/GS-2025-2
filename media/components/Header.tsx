import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showAvatar?: boolean;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showAvatar = false,
  backgroundColor = '#005F99',
  style
}) => {
  return (
    <View style={[styles.header, { backgroundColor }, style]}>
      {showAvatar && (
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#FFF" />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 5,
    opacity: 0.9,
  },
});

