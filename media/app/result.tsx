import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const idTriagem = params.id;
  const nivelUrgencia = Number(params.nivelUrgencia || 0);
  const sintomasTexto = params.sintomas as string || "Não informado";

  const getCorUrgencia = (nivel: number) => {
    if (nivel >= 4) return '#D32F2F';
    if (nivel === 3) return '#FBC02D';
    return '#388E3C';
  };

  const corTema = getCorUrgencia(nivelUrgencia);

  const dadosResumo = {
    app: "MEDIA_GS",
    id: idTriagem,
    paciente: "Jennyfer Lee",
    urgencia: nivelUrgencia,
    sintomas: sintomasTexto,
    data: new Date().toISOString()
  };

  const qrCodeValue = JSON.stringify(dadosResumo);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.card, { borderTopColor: corTema, borderTopWidth: 5 }]}>
        <Ionicons name="checkmark-circle" size={60} color={corTema} style={styles.icon} />

        <Text style={styles.title}>Pré-Triagem Concluída!</Text>
        <Text style={styles.subtitle}>
          Sua pré-triagem foi realizada com sucesso.
        </Text>

        <View style={[styles.urgencyBox, { backgroundColor: corTema }]}>
          <Text style={styles.urgencyTitle}>NÍVEL DE URGÊNCIA</Text>
          <Text style={styles.urgencyValue}>{nivelUrgencia}</Text>
        </View>

        <Text style={styles.infoText}>
          Dirija-se à unidade de sua preferência.
        </Text>
        <Text style={styles.instructionBold}>
          Consulte a aba "Unidades" para ver endereços.
        </Text>

        <View style={styles.qrBox}>
          <QRCode
            value={qrCodeValue}
            size={180}
            color="black"
            backgroundColor="white"
          />
          <Text style={styles.hashText}>#{idTriagem} • Escaneie na recepção</Text>
        </View>

        <Text style={styles.instruction}>
          Mantenha esta tela aberta ao chegar no hospital.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: corTema }]}
        onPress={() => router.replace('/(tabs)/history')}
      >
        <Text style={styles.buttonText}>VER NO MEU HISTÓRICO</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F5F5F5', padding: 20, alignItems: 'center' },
  card: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
  },
  icon: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },

  urgencyBox: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  urgencyTitle: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  urgencyValue: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },

  infoText: { color: '#666', fontSize: 14, textAlign: 'center' },
  instructionBold: { fontSize: 15, fontWeight: 'bold', color: '#005F99', marginBottom: 20, textAlign: 'center' },

  qrBox: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE'
  },
  hashText: { fontSize: 12, color: '#999', marginTop: 10 },

  instruction: { fontSize: 14, color: '#333', textAlign: 'center', fontStyle: 'italic' },

  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});