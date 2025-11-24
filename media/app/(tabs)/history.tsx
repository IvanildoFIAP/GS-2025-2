import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../../services/api';
import { authService } from '../../services/auth';
import { TriagemResponse } from '../../types';

export default function HistoryScreen() {
  const [triagens, setTriagens] = useState<TriagemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const pacienteId = await authService.getUserId();
      if (!pacienteId) {
        console.log('Usuário não identificado');
        setTriagens([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      console.log('Buscando histórico para pacienteId:', pacienteId);
      const dados = await apiService.buscarHistorico({
        pacienteId,
        sort: 'dataDesc',
        page: 1,
        size: 100
      });
      console.log('Triagens recebidas:', dados);
      setTriagens(Array.isArray(dados) ? dados : []);
    } catch (error: any) {
      console.error('Erro ao carregar histórico:', error);
      console.error('Detalhes do erro:', error.response?.data || error.message);
      setTriagens([]);
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#005F99" style={{ marginTop: 20 }} />
      ) : triagens.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#CCC" />
          <Text style={styles.emptyText}>Nenhuma triagem encontrada</Text>
          <Text style={styles.emptySubtext}>Suas triagens aparecerão aqui</Text>
        </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  listContent: { padding: 15 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#666', marginTop: 20, marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#999', textAlign: 'center' },
  
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
});