import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../../services/api';
import { TriagemResponse } from '../../types';

export default function HistoryScreen() {
  const [triagens, setTriagens] = useState<TriagemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [idParaCancelar, setIdParaCancelar] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const dados = await apiService.buscarHistorico({ pacienteId: 1, sort: 'dataDesc' });
      setTriagens(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.log('Erro ao carregar');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const abrirConfirmacao = (id: number) => {
    setIdParaCancelar(id);
    setModalVisible(true);
  };

  const confirmarCancelamento = async () => {
    if (idParaCancelar === null) return;

    try {
      setModalVisible(false);
      setLoading(true);

      await apiService.cancelarTriagem(idParaCancelar);
      await loadData();

    } catch (error) {
      alert("Erro ao cancelar");
    } finally {
      setLoading(false);
      setIdParaCancelar(null);
    }
  };

  const getCorUrgencia = (nivel: number) => {
    if (nivel >= 4) return '#D32F2F';
    if (nivel === 3) return '#FBC02D';
    return '#388E3C';
  };

  const renderItem = ({ item }: { item: TriagemResponse }) => {
    const corUrgencia = getCorUrgencia(item.nivelUrgencia);
    const isAberta = item.status === 1;
    const isCancelada = item.status === 0;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.badgeId}>
            <Text style={styles.badgeText}>#{item.id}</Text>
          </View>
          <Text style={styles.dateText}>
            {new Date(item.dataCriacao).toLocaleDateString('pt-BR')}
          </Text>
        </View>

        <Text style={styles.sintomas} numberOfLines={2}>{item.sintomasDescricao}</Text>

        <View style={styles.footer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.dot, { backgroundColor: corUrgencia }]} />
            <Text style={styles.urgenciaText}>Urgência {item.nivelUrgencia}</Text>
          </View>

          <View style={[
            styles.statusBadge,
            { backgroundColor: isAberta ? '#E3F2FD' : (isCancelada ? '#FFEBEE' : '#F5F5F5') }
          ]}>
            <Text style={[
              styles.statusText,
              { color: isAberta ? '#1976D2' : (isCancelada ? '#C62828' : '#666') }
            ]}>
              {isAberta ? 'ABERTA' : (isCancelada ? 'CANCELADA' : 'FINALIZADA')}
            </Text>
          </View>
        </View>

        {isAberta && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => abrirConfirmacao(item.id)}
          >
            <Ionicons name="close-circle-outline" size={20} color="#C62828" />
            <Text style={styles.cancelText}>Cancelar Triagem</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#005F99" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={triagens}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
          }
        />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="warning-outline" size={50} color="#C62828" style={{marginBottom: 15}} />

            <Text style={styles.modalTitle}>Cancelar Solicitação?</Text>
            <Text style={styles.modalText}>
              Tem certeza que deseja cancelar a triagem #{idParaCancelar}? Essa ação não pode ser desfeita.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.btnCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textBtnCancel}>Não, voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.btnConfirm]}
                onPress={confirmarCancelamento}
              >
                <Text style={styles.textBtnConfirm}>Sim, Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  listContent: { padding: 15 },

  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badgeId: { backgroundColor: '#EEE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontWeight: 'bold', color: '#555', fontSize: 12 },
  dateText: { color: '#999', fontSize: 12 },
  sintomas: { fontSize: 16, color: '#333', marginBottom: 15, lineHeight: 22 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  urgenciaText: { fontSize: 14, fontWeight: 'bold', color: '#555' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  cancelButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  cancelText: { color: '#C62828', marginLeft: 5, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  modalText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 25 },
  modalButtons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  modalBtn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
  btnCancel: { backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#DDD' },
  btnConfirm: { backgroundColor: '#C62828' },
  textBtnCancel: { color: '#333', fontWeight: 'bold' },
  textBtnConfirm: { color: '#FFF', fontWeight: 'bold' },
});