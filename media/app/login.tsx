import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiService } from '../services/api';

export default function LoginScreen() {
  const router = useRouter();

  const [documento, setDocumento] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    setErro('');

    if (!documento || !senha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    // Apenas dígitos do CPF
    const cpfDigits = documento.replace(/\D/g, '');
    if (cpfDigits.length !== 11) {
      setErro('CPF inválido. Insira 11 números.');
      return;
    }

    setLoading(true);

    try {
      await apiService.login(cpfDigits);
      router.replace('/(tabs)');
    } catch (error) {
      setErro('Falha no login. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MEDIA</Text>
        <Text style={styles.subtitle}>Pré-triagem inteligente</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>CPF</Text>
        <TextInput
          style={styles.input}
          placeholder="000.000.000-00"
          placeholderTextColor="#999"
          value={documento}
          onChangeText={setDocumento}
          keyboardType="numeric"
          autoComplete="off"
          textContentType="none"
          autoCorrect={false}
          autoCapitalize="none"
          importantForAutofill="no"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••"
          placeholderTextColor="#999"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>ENTRAR</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.registerText}>
            Ainda não tem conta? <Text style={styles.registerBold}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    padding: 20,
  },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#005F99', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666' },
  form: { width: '100%' },
  label: { fontSize: 14, color: '#333', marginBottom: 5, marginLeft: 5, fontWeight: '600' },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#005F99',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
    height: 50,
    justifyContent: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  registerLink: { marginTop: 20, alignItems: 'center' },
  registerText: { color: '#666', fontSize: 14 },
  registerBold: { color: '#005F99', fontWeight: 'bold' },
});