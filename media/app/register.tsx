import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiService } from '../services/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [documento, setDocumento] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = async () => {
    setErro('');
    setSucesso('');

    if (!nomeCompleto || !documento || !dataNascimento || !telefone || !endereco) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    // Validar CPF (apenas dígitos, 11 números)
    const cpfDigits = documento.replace(/\D/g, '');
    if (cpfDigits.length !== 11) {
      setErro('CPF inválido. Insira 11 números.');
      return;
    }

    // Validar e converter data de nascimento de DD/MM/AAAA para AAAA-MM-DD
    const match = dataNascimento.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) {
      setErro('Data de nascimento inválida. Use DD/MM/AAAA.');
      return;
    }
    const [, dd, mm, yyyy] = match;
    const isoDate = `${yyyy}-${mm}-${dd}`;

    setLoading(true);

    try {
      const payload = {
        nomeCompleto,
        documento: cpfDigits,
        dataNascimento: isoDate,
        telefone,
        endereco,
        latitude: -23.5505,
        longitude: -46.6333,
      };

      await apiService.criarPaciente(payload);

      setSucesso('Cadastro realizado com sucesso! Redirecionando...');

      setTimeout(() => {
        router.back();
      }, 1500);

    } catch (error) {
      setErro('Não foi possível realizar o cadastro. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha seus dados para a triagem</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput style={styles.input} value={nomeCompleto} onChangeText={setNomeCompleto} placeholder="Ex: Maria Silva" />

        <Text style={styles.label}>CPF</Text>
        <TextInput
          style={styles.input}
          value={documento}
          onChangeText={setDocumento}
          keyboardType="numeric"
          placeholder="Insira um CPF válido"
          autoComplete="off"
          textContentType="none"
          autoCorrect={false}
          autoCapitalize="none"
          importantForAutofill="no"
        />

        <Text style={styles.label}>Data de Nascimento</Text>
        <TextInput style={styles.input} value={dataNascimento} onChangeText={setDataNascimento} placeholder="DD/MM/AAAA" />

        <Text style={styles.label}>Telefone</Text>
        <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" placeholder="(11) 99999-9999" />

        <Text style={styles.label}>Endereço</Text>
        <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Rua, Número - Bairro" />

        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry placeholder="Mínimo 6 caracteres" />

        {erro ? <Text style={styles.errorText}>{erro}</Text> : null}
        {sucesso ? <Text style={styles.successText}>{sucesso}</Text> : null}

        <TouchableOpacity
          style={[styles.button, sucesso ? styles.buttonSuccess : null]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>CADASTRAR</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Voltar para Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#F5F5F5', padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#005F99' },
  subtitle: { color: '#666', marginTop: 5 },
  form: { width: '100%' },
  label: { fontSize: 14, color: '#333', marginBottom: 5, fontWeight: '600' },
  input: { backgroundColor: '#FFF', borderRadius: 8, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#DDD' },

  errorText: { color: 'red', textAlign: 'center', marginBottom: 10, fontWeight: 'bold' },
  successText: { color: 'green', textAlign: 'center', marginBottom: 10, fontWeight: 'bold', fontSize: 16 },

  button: { backgroundColor: '#005F99', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonSuccess: { backgroundColor: 'green' },

  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  backButton: { marginTop: 20, alignItems: 'center', marginBottom: 20 },
  backText: { color: '#666' },
});