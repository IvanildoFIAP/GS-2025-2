import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Ionicons name="warning-outline" size={50} color="#C62828" style={styles.icon} />
          
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalBtn, styles.btnCancel]} 
              onPress={onClose}
            >
              <Text style={styles.textBtnCancel}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalBtn, styles.btnConfirm]} 
              onPress={onConfirm}
            >
              <Text style={styles.textBtnConfirm}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  icon: {
    marginBottom: 15,
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

