import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { mockStudioData, StudioData } from '../../lib/mockData';
import SafeScreen from '../SafeScreen';

interface StudioDataModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function StudioDataModal({ visible, onClose }: StudioDataModalProps) {
  const [studioData, setStudioData] = useState<StudioData>(mockStudioData);

  const handleSave = () => {
    Alert.alert('✅ Datos guardados', 'La información del estudio se actualizó correctamente');
    onClose();
  };

  const handleOpenMaps = () => {
    if (studioData.googleMapsLink) {
      Linking.openURL(studioData.googleMapsLink).catch(() => {
        Alert.alert('Error', 'No se pudo abrir Google Maps');
      });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeScreen>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalClose}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Datos del Estudio</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.modalSave}>Guardar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalScroll}>
          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Nombre del estudio *</Text>
            <TextInput
              style={styles.input}
              value={studioData.name}
              onChangeText={(text) => setStudioData({ ...studioData, name: text })}
            />

            <Text style={styles.inputLabel}>Dirección *</Text>
            <TextInput
              style={styles.input}
              value={studioData.address}
              onChangeText={(text) => setStudioData({ ...studioData, address: text })}
            />

            <Text style={styles.inputLabel}>Link de Google Maps</Text>
            <View style={styles.inputWithButton}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                value={studioData.googleMapsLink}
                onChangeText={(text) => setStudioData({ ...studioData, googleMapsLink: text })}
                placeholder="https://maps.google.com/?q=..."
              />
              <TouchableOpacity style={styles.testButton} onPress={handleOpenMaps}>
                <Text style={styles.testButtonText}>Abrir</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Teléfono *</Text>
            <TextInput
              style={styles.input}
              value={studioData.phone}
              onChangeText={(text) => setStudioData({ ...studioData, phone: text })}
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={studioData.email}
              onChangeText={(text) => setStudioData({ ...studioData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Instagram</Text>
            <TextInput
              style={styles.input}
              value={studioData.instagram}
              onChangeText={(text) => setStudioData({ ...studioData, instagram: text })}
              placeholder="@tu_usuario"
            />

            <Text style={styles.inputLabel}>Horarios de atención</Text>
            <TextInput
              style={styles.input}
              value={studioData.workingHours}
              onChangeText={(text) => setStudioData({ ...studioData, workingHours: text })}
              placeholder="Lun-Vie: 10:00-20:00"
            />

            <Text style={styles.inputLabel}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={studioData.description}
              onChangeText={(text) => setStudioData({ ...studioData, description: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="Breve descripción de tu estudio..."
            />
          </View>
        </ScrollView>
      </SafeScreen>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
    width: 60,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    width: 60,
    textAlign: 'right',
  },
  modalScroll: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  modalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  inputWithButton: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  testButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});