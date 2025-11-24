import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../../services/api';
import { UnidadeSaude } from '../../types';
import { Card, Badge, LoadingSpinner, EmptyState } from '../../components';

const ZONAS = ["Todas", "Centro", "Norte", "Sul", "Leste", "Oeste"];

export default function UnitsScreen() {
  const [unidades, setUnidades] = useState<UnidadeSaude[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroZona, setFiltroZona] = useState("Todas");

  const loadData = async () => {
    try {
      const dados = await apiService.listarUnidades();
      setUnidades(dados);
    } catch (error) {
      console.log('Erro ao carregar unidades');
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

  const unidadesFiltradas = unidades.filter(u =>
    filtroZona === "Todas" ? true : u.ocupacao === filtroZona
  );

  const renderItem = ({ item }: { item: UnidadeSaude }) => {
    return (
      <Card>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="location" size={24} color="#005F99" />
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.name}>{item.nome}</Text>
              <Badge text={item.ocupacao} />
            </View>

            <Text style={styles.address}>{item.endereco}</Text>

            {item.telefone && (
              <Text style={styles.phone}>
                <Ionicons name="call-outline" size={12} color="#666" /> {item.telefone}
              </Text>
            )}
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Unidades de Saúde</Text>
        <Text style={styles.subtitle}>Encontre o posto mais próximo de você</Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {ZONAS.map((zona) => (
            <TouchableOpacity
              key={zona}
              style={[
                styles.filterChip,
                filtroZona === zona && styles.filterChipActive
              ]}
              onPress={() => setFiltroZona(zona)}
            >
              <Text style={[
                styles.filterText,
                filtroZona === zona && styles.filterTextActive
              ]}>
                {zona}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={unidadesFiltradas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="Nenhuma unidade encontrada nesta região."
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 20, paddingBottom: 10, backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#005F99' },
  subtitle: { fontSize: 14, color: '#666' },
  filterContainer: { backgroundColor: '#FFF', paddingBottom: 10 },
  scrollContent: { paddingHorizontal: 15 },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#005F99',
  },
  filterText: { color: '#666', fontWeight: '600' },
  filterTextActive: { color: '#005F99', fontWeight: 'bold' },
  listContent: { padding: 15 },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E1F5FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  infoContainer: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 5 },
  address: { fontSize: 13, color: '#666', marginTop: 4 },
  phone: { fontSize: 12, color: '#888', marginTop: 4 },
});