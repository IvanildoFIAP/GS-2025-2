import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { apiService } from '../../services/api';
import { authService } from '../../services/auth';
import { TriagemResponse } from '../../types';
import { Card, Badge, LoadingSpinner, EmptyState } from '../../components';

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

  const getStatus = (status: number) => {
    if (status === 1) return 'open';
    if (status === 0) return 'cancelled';
    return 'closed';
  };

  const renderItem = ({ item }: { item: TriagemResponse }) => {
    const statusText = item.status === 1 ? 'ABERTA' : (item.status === 0 ? 'CANCELADA' : 'FINALIZADA');

    return (
      <Card>
        <View style={styles.cardHeader}>
          <Badge text={`#${item.id}`} />
          <Text style={styles.dateText}>
            {new Date(item.dataCriacao).toLocaleDateString('pt-BR')}
          </Text>
        </View>

        <Text style={styles.sintomas} numberOfLines={2}>{item.sintomasDescricao}</Text>

        <View style={styles.footer}>
          <View style={styles.urgencyContainer}>
            <Badge
              text={`Urgência ${item.nivelUrgencia}`}
              variant="urgency"
              urgencyLevel={item.nivelUrgencia}
              fontSize={14}
            />
          </View>

          <Badge
            text={statusText}
            variant="status"
            status={getStatus(item.status)}
          />
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <LoadingSpinner />
      ) : triagens.length === 0 ? (
        <EmptyState
          title="Nenhuma triagem encontrada"
          subtitle="Suas triagens aparecerão aqui"
        />
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  dateText: { color: '#999', fontSize: 12 },
  sintomas: { fontSize: 16, color: '#333', marginBottom: 15, lineHeight: 22 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 10 },
  urgencyContainer: { flexDirection: 'row', alignItems: 'center' },
});