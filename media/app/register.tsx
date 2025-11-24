import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiService } from '../services/api';
import { Navigation } from '../services/navigation';
import { maskCPF, maskPhone, maskDate, validateCPF, removeNonNumeric, convertDateToISO } from '../utils/masks';
import { Button, Input, Header } from '../components';

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
  const [cpfError, setCpfError] = useState('');

  const handleCPFChange = (value: string) => {
    const masked = maskCPF(value);
    setDocumento(masked);
    setCpfError('');
    
    const cpfDigits = removeNonNumeric(masked);
    if (cpfDigits.length === 11) {
      if (!validateCPF(masked)) {
        setCpfError('CPF inválido. Verifique os dígitos.');
      }
    }
  };

  const handlePhoneChange = (value: string) => {
    const masked = maskPhone(value);
    setTelefone(masked);
  };

  const handleDateChange = (value: string) => {
    const masked = maskDate(value);
    setDataNascimento(masked);
  };

  const handleRegister = async () => {
    setErro('');
    setSucesso('');
    setCpfError('');

    if (!nomeCompleto || !documento || !dataNascimento || !telefone || !endereco) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    const cpfDigits = removeNonNumeric(documento);
    if (cpfDigits.length !== 11) {
      setErro('CPF inválido. Insira 11 números.');
      return;
    }

    if (!validateCPF(documento)) {
      setErro('CPF inválido. Verifique os dígitos.');
      setCpfError('CPF inválido. Verifique os dígitos.');
      return;
    }

    let isoDate: string;
    try {
      isoDate = convertDateToISO(dataNascimento);
    } catch (error) {
      setErro('Data de nascimento inválida. Use DD-MM-YYYY.');
      return;
    }

    const phoneDigits = removeNonNumeric(telefone);
    if (phoneDigits.length < 10) {
      setErro('Telefone inválido. Insira pelo menos 10 dígitos.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nomeCompleto,
        documento: cpfDigits,
        dataNascimento: isoDate,
        telefone: phoneDigits,
        endereco,
        latitude: -23.5505,
        longitude: -46.6333,
      };

      await apiService.criarPaciente(payload);

      setSucesso('Cadastro realizado com sucesso! Redirecionando...');

      setTimeout(() => {
        Navigation.back(router);
      }, 1500);

    } catch (error) {
      setErro('Não foi possível realizar o cadastro. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Header
        title="Criar Conta"
        subtitle="Preencha seus dados para a triagem"
        backgroundColor="#F5F5F5"
        style={styles.header}
      />

      <View style={styles.form}>
        <Input
          label="Nome Completo"
          value={nomeCompleto}
          onChangeText={setNomeCompleto}
          placeholder="Ex: Maria Silva"
        />

        <Input
          label="CPF"
          value={documento}
          onChangeText={handleCPFChange}
          keyboardType="numeric"
          placeholder="000.000.000-00"
          maxLength={14}
          autoComplete="off"
          textContentType="none"
          autoCorrect={false}
          autoCapitalize="none"
          importantForAutofill="no"
          error={cpfError}
        />

        <Input
          label="Data de Nascimento"
          value={dataNascimento}
          onChangeText={handleDateChange}
          keyboardType="numeric"
          placeholder="DD-MM-AAAA"
          maxLength={10}
        />

        <Input
          label="Telefone"
          value={telefone}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          placeholder="(11) 99999-9999"
          maxLength={15}
        />

        <Input
          label="Endereço"
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Rua, Número - Bairro"
        />

        <Input
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="Mínimo 6 caracteres"
        />

        {erro ? <Text style={styles.errorText}>{erro}</Text> : null}
        {sucesso ? <Text style={styles.successText}>{sucesso}</Text> : null}

        <Button
          title="CADASTRAR"
          onPress={handleRegister}
          loading={loading}
          variant={sucesso ? 'success' : 'primary'}
        />

        <TouchableOpacity style={styles.backButton} onPress={() => Navigation.back(router)}>
          <Text style={styles.backText}>Voltar para Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#F5F5F5', padding: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  form: { width: '100%' },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10, fontWeight: 'bold' },
  successText: { color: 'green', textAlign: 'center', marginBottom: 10, fontWeight: 'bold', fontSize: 16 },
  backButton: { marginTop: 20, marginBottom: 20, backgroundColor: 'transparent' },
  backText: { color: '#666' },
});