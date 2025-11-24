import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../../services/api';
import { authService } from '../../services/auth';
import { Navigation } from '../../services/navigation';
import { maskPhone, removeNonNumeric } from '../../utils/masks';
import { Button, Input, Header, ConfirmModal } from '../../components';

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
        Navigation.replaceLogin(router);
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
      
      Navigation.dismissAll(router);
      Navigation.replaceLogin(router);

    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Não foi possível excluir a conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header title="Meu Perfil" showAvatar />

      <View style={styles.form}>
        <Input
          label="Nome Completo"
          value={nome}
          onChangeText={setNome}
        />

        <Input
          label="Telefone"
          value={telefone}
          onChangeText={(value) => setTelefone(maskPhone(value))}
          keyboardType="phone-pad"
          maxLength={15}
        />

        <Input
          label="Endereço"
          value={endereco}
          onChangeText={setEndereco}
        />

        <Button
          title="SALVAR ALTERAÇÕES"
          onPress={handleSalvar}
          loading={loading}
        />

        <View style={styles.divider} />

        <TouchableOpacity style={styles.deleteButton} onPress={handleBotaoExcluir}>
          <Ionicons name="trash-outline" size={20} color="#C62828" />
          <Text style={styles.deleteText}>Excluir minha conta</Text>
        </TouchableOpacity>
      </View>

      <ConfirmModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={confirmarExclusao}
        title="Tem certeza?"
        message="Essa ação apagará todos os seus dados e histórico de triagens. Não é possível desfazer."
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F5F5F5' },
  form: { padding: 20 },
  divider: { height: 1, backgroundColor: '#DDD', marginVertical: 30 },
  deleteButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: '#C62828', borderRadius: 8, backgroundColor: '#FFEBEE' },
  deleteText: { color: '#C62828', fontWeight: 'bold', marginLeft: 10 },
});