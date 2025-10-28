import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { createClient } from '../lib/clientService';

type Props = NativeStackScreenProps<RootStackParamList, 'NewClient'>;

export default function NewClientScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [plannedSessions, setPlannedSessions] = useState('1');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!fullName || !phone) {
      Alert.alert('Error', 'Por favor completá nombre y teléfono');
      return;
    }

    const sessions = parseInt(plannedSessions);
    if (isNaN(sessions) || sessions < 1) {
      Alert.alert('Error', 'Las sesiones deben ser al menos 1');
      return;
    }

    setLoading(true);
    try {
      await createClient({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        instagram: instagram.trim() || undefined,
        plannedSessions: sessions,
        notes: notes.trim() || undefined,
      });

      Alert.alert(
        '✅ Cliente creado',
        `${fullName} fue agregado correctamente con ${sessions} ${sessions === 1 ? 'sesión planificada' : 'sesiones planificadas'}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creando cliente:', error);
      Alert.alert('Error', 'No se pudo crear el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scroll}>
        <View style={styles.content}>
          {/* Nombre completo */}
          <View style={styles.section}>
            <Text style={styles.label}>Nombre completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ejemplo: Juan Pérez"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          {/* Teléfono */}
          <View style={styles.section}>
            <Text style={styles.label}>Teléfono *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ejemplo: +54 9 11 1234-5678"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!loading}
            />
            <Text style={styles.hint}>
              Usá este número para enviar recordatorios por WhatsApp
            </Text>
          </View>

          {/* Email */}
          <View style={styles.section}>
            <Text style={styles.label}>Email (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="ejemplo@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Instagram */}
          <View style={styles.section}>
            <Text style={styles.label}>Instagram (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="@usuario"
              placeholderTextColor="#999"
              value={instagram}
              onChangeText={setInstagram}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Sesiones planificadas */}
          <View style={styles.section}>
            <Text style={styles.label}>Sesiones planificadas *</Text>
            <View style={styles.sessionSelector}>
              {['1', '2', '3', '4', '5', '6+'].map(num => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.sessionButton,
                    plannedSessions === num && styles.sessionButtonActive,
                  ]}
                  onPress={() => setPlannedSessions(num)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.sessionButtonText,
                      plannedSessions === num && styles.sessionButtonTextActive,
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {plannedSessions === '6+' && (
              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                placeholder="Ingresá el número exacto"
                placeholderTextColor="#999"
                keyboardType="numeric"
                onChangeText={setPlannedSessions}
                editable={!loading}
              />
            )}
            <Text style={styles.hint}>
              ¿Cuántas sesiones necesitará este tatuaje?
            </Text>
          </View>

          {/* Notas */}
          <View style={styles.section}>
            <Text style={styles.label}>Notas (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Alergias, preferencias, zona del cuerpo, estilo de tatuaje..."
              placeholderTextColor="#999"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!loading}
            />
          </View>

          {/* Info adicional */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              Podés agregar más información y ver el progreso después de crear el cliente
            </Text>
          </View>

          {/* Botones */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveButton, loading && styles.buttonDisabled]} 
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Creando...' : 'Crear cliente'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  sessionSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sessionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    minWidth: 60,
    alignItems: 'center',
  },
  sessionButtonActive: {
    borderColor: '#000',
    backgroundColor: '#000',
  },
  sessionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  sessionButtonTextActive: {
    color: '#fff',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#0369a1',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});