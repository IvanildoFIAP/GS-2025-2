import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView, Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../../services/api';
import { authService } from '../../services/auth';
import { maskPhone, removeNonNumeric } from '../../utils/masks';

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pacienteId, setPacienteId] = useState<number | null>(null);

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dadosCompletos, setDadosCompletos] = useState<any>(null);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const id = await authService.getUserId();
      if (!id) {
        alert("Sessão expirada. Faça login novamente.");
        router.replace('/login');
        return;
      }
      setPacienteId(id);
      const dados = await apiService.buscarPerfil(id);
      
      setDadosCompletos(dados);
      setNome(dados.nomeCompleto);
      const telefoneFormatado = dados.telefone ? maskPhone(dados.telefone) : '';
      setTelefone(telefoneFormatado);
      setEndereco(dados.endereco);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

  const handleSalvar = async () => {
    if (!pacienteId || !dadosCompletos) return;
    
    if (!nome.trim() || !telefone.trim() || !endereco.trim()) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    
    setLoading(true);
    try {
      const telefoneLimpo = removeNonNumeric(telefone);
      
      const dadosAtualizados: any = {
        id: pacienteId,
        nomeCompleto: nome.trim(),
        documento: dadosCompletos.documento,
        dataNascimento: dadosCompletos.dataNascimento,
        telefone: telefoneLimpo,
        endereco: endereco.trim(),
        latitude: dadosCompletos.latitude || -23.5505,
        longitude: dadosCompletos.longitude || -46.6333
      };
      
      await apiService.atualizarPerfil(pacienteId, dadosAtualizados);
      
      setDadosCompletos({ ...dadosCompletos, ...dadosAtualizados });
      await authService.saveUser({ id: pacienteId, nome: nome.trim() });
      
      alert("Sucesso! Dados atualizados.");
    } catch (error) {
      alert("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleBotaoExcluir = () => {
    if (!pacienteId) {
      alert("Erro: Usuário não identificado.");
      return;
    }
    setModalVisible(true);
  };

  const confirmarExclusao = async () => {
    if (!pacienteId) return;

    setModalVisible(false);
    setLoading(true);

    try {
      await apiService.excluirConta(pacienteId);
      
      await authService.clearUser();
      
      alert("Conta excluída com sucesso.");
      
      router.dismissAll();
      router.replace('/login');

    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Não foi possível excluir a conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={(value) => setTelefone(maskPhone(value))}
          keyboardType="phone-pad"
          maxLength={15}
        />

        <Text style={styles.label}>Endereço</Text>
        <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} />

        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveText}>SALVAR ALTERAÇÕES</Text>}
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.deleteButton} onPress={handleBotaoExcluir}>
          <Ionicons name="trash-outline" size={20} color="#C62828" />
          <Text style={styles.deleteText}>Excluir minha conta</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="warning-outline" size={50} color="#C62828" style={{marginBottom: 15}} />
            
            <Text style={styles.modalTitle}>Tem certeza?</Text>
            <Text style={styles.modalText}>
              Essa ação apagará todos os seus dados e histórico de triagens. Não é possível desfazer.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.btnCancel]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textBtnCancel}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalBtn, styles.btnConfirm]} 
                onPress={confirmarExclusao}
              >
                <Text style={styles.textBtnConfirm}>Sim, Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  btnCancel: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  btnConfirm: {
    backgroundColor: '#C62828',
  },
  textBtnCancel: {
    color: '#333',
    fontWeight: 'bold',
  },
  textBtnConfirm: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});