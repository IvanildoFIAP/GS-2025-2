import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...textInputProps
}) => {
  return (
    <View style={containerStyle}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style
        ]}
        {...textInputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
});

