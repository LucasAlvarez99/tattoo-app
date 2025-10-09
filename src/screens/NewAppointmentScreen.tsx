import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { mockClients } from '../lib/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'NewAppointment'>;

export default function NewAppointmentScreen({ navigation, route }: Props) {
  const [selectedClient, setSelectedClient] = useState(route.params?.clientId || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [notes, setNotes] = useState('');
  const [price, setPrice] = useState('');

  const handleSave = () => {
    if (!selectedClient || !date || !time) {
      Alert.alert('Error', 'Por favor completá los campos requeridos');
      return;
    }

    Alert.alert(
      '✅ Cita creada',
      'La cita se creó correctamente',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Selector de cliente */}
        <View style={styles.section}>
          <Text style={styles.label}>Cliente *</Text>
          <View style={styles.clientSelector}>
            {mockClients.map(client => (
              <TouchableOpacity
                key={client.id}
                style={[
                  styles.clientChip,
                  selectedClient === client.id && styles.clientChipSelected,
                ]}
                onPress={() => setSelectedClient(client.id)}
              >
                <Text
                  style={[
                    styles.clientChipText,
                    selectedClient === client.id && styles.clientChipTextSelected,
                  ]}
                >
                  {client.fullName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.newClientButton}
            onPress={() => navigation.navigate('NewClient')}
          >
            <Text style={styles.newClientButtonText}>+ Crear nuevo cliente</Text>
          </TouchableOpacity>
        </View>

        {/* Fecha */}
        <View style={styles.section}>
          <Text style={styles.label}>Fecha *</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
            placeholderTextColor="#999"
            value={date}
            onChangeText={setDate}
            keyboardType="numeric"
          />
          <Text style={styles.hint}>Ejemplo: 15/10/2025</Text>
        </View>

        {/* Hora */}
        <View style={styles.section}>
          <Text style={styles.label}>Hora *</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            placeholderTextColor="#999"
            value={time}
            onChangeText={setTime}
            keyboardType="numeric"
          />
          <Text style={styles.hint}>Ejemplo: 14:30</Text>
        </View>

        {/* Duración */}
        <View style={styles.section}>
          <Text style={styles.label}>Duración (minutos)</Text>
          <View style={styles.durationSelector}>
            {['30', '60', '90', '120', '180'].map(mins => (
              <TouchableOpacity
                key={mins}
                style={[
                  styles.durationChip,
                  duration === mins && styles.durationChipSelected,
                ]}
                onPress={() => setDuration(mins)}
              >
                <Text
                  style={[
                    styles.durationChipText,
                    duration === mins && styles.durationChipTextSelected,
                  ]}
                >
                  {mins}min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Precio */}
        <View style={styles.section}>
          <Text style={styles.label}>Precio estimado ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ejemplo: 25000"
            placeholderTextColor="#999"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>

        {/* Notas */}
        <View style={styles.section}>
          <Text style={styles.label}>Notas</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Detalles del tatuaje, ubicación, diseño..."
            placeholderTextColor="#999"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Botones */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Crear cita</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  clientSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  clientChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  clientChipSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  clientChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  clientChipTextSelected: {
    color: '#fff',
  },
  newClientButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  newClientButtonText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  durationSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  durationChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  durationChipSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  durationChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  durationChipTextSelected: {
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
});