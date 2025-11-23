import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../../services/api';

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const dados = await apiService.buscarPerfil(1);
      setNome(dados.nomeCompleto);
      setTelefone(dados.telefone);
      setEndereco(dados.endereco);
    } catch (error) {
      console.log("Erro ao carregar perfil");
    }
  };

  const handleSalvar = async () => {
    setLoading(true);
    try {
      await apiService.atualizarPerfil(1, {
        nomeCompleto: nome,
        telefone,
        endereco
      });
      Alert.alert("Sucesso", "Dados atualizados!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar.");
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = () => {
    Alert.alert(
      "Excluir Conta",
      "Tem certeza? Isso apagará todos os seus dados.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, Excluir",
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.excluirConta(1);
              router.replace('/login');
            } catch (error) {
              Alert.alert("Erro", "Não foi possível excluir.");
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#FFF" />
        </View>
        <Text style={styles.title}>Meu Perfil</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Telefone</Text>
        <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

        <Text style={styles.label}>Endereço</Text>
        <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} />

        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveText}>SALVAR ALTERAÇÕES</Text>}
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.deleteButton} onPress={handleExcluir}>
          <Ionicons name="trash-outline" size={20} color="#C62828" />
          <Text style={styles.deleteText}>Excluir minha conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#005F99', padding: 30, alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  form: { padding: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 5, fontWeight: 'bold' },
  input: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#DDD' },
  saveButton: { backgroundColor: '#005F99', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saveText: { color: '#FFF', fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#DDD', marginVertical: 30 },
  deleteButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: '#C62828', borderRadius: 8, backgroundColor: '#FFEBEE' },
  deleteText: { color: '#C62828', fontWeight: 'bold', marginLeft: 10 },
});