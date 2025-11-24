import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';
import { apiService } from '../../services/api';
import { authService } from '../../services/auth';
import { Navigation } from '../../services/navigation';
import { Button, Card } from '../../components';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const [sintomas, setSintomas] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [userName, setUserName] = useState('');
  const [pacienteId, setPacienteId] = useState<number | null>(null);

  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  const carregarDadosUsuario = async () => {
    const name = await authService.getUserName();
    const id = await authService.getUserId();
    if (name) setUserName(name);
    if (id) setPacienteId(id);
  };

  const handleAnalise = async () => {
    if (!sintomas.trim()) {
      setErro('Por favor, descreva o que você está sentindo.');
      return;
    }

    setLoading(true);
    setErro('');

    if (!pacienteId) {
      setErro('Erro ao identificar usuário. Faça login novamente.');
      return;
    }

    try {
      const dadosTriagem = {
        pacienteId: pacienteId,
        sintomasDescricao: sintomas
      };

      const resultado = await apiService.analisarSintomas(dadosTriagem);

      Navigation.result(router, {
        id: resultado.id,
        nivelUrgencia: resultado.nivelUrgencia,
        qrCodeBase64: resultado.qrCodeBase64,
        sintomas: resultado.sintomasDescricao
      });

      setSintomas('');

    } catch (error) {
      setErro('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {userName || 'Usuário'}</Text>
        <Text style={styles.question}>O que você está sentindo hoje?</Text>
      </View>

      <Card>
        <Text style={styles.label}>Descreva seus sintomas:</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Ex: Estou com muita dor de cabeça, febre alta desde ontem e dor no corpo..."
          placeholderTextColor="#999"
          multiline={true}
          numberOfLines={6}
          textAlignVertical="top"
          value={sintomas}
          onChangeText={setSintomas}
        />

        {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

        <Button
          title="ANALISAR SINTOMAS"
          onPress={handleAnalise}
          loading={loading}
        />
      </Card>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Como funciona?</Text>
        <Text style={styles.infoDesc}>
          Analisamos seus sintomas e geramos um QR Code para agilizar seu atendimento.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20
  },
  header: {
    marginTop: 20,
    marginBottom: 20
  },
  greeting: {
    fontSize: 18,
    color: '#666'
  },
  question: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#005F99',
    width: '80%'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  textArea: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    padding: 15,
    height: 150,
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontWeight: 'bold'
  },
  infoBox: {
    marginTop: 30,
    padding: 10
  },
  infoTitle: {
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5
  },
  infoDesc: {
    color: '#888',
    lineHeight: 20
  },
});