import React, { useState, useEffect } from 'react';
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
import { getAllClients, ExtendedClient } from '../lib/clientService';
import { createAppointment } from '../lib/appointmentService';
import { scheduleAppointmentNotification } from '../lib/notificationScheduler';

type Props = NativeStackScreenProps<RootStackParamList, 'NewAppointment'>;

export default function NewAppointmentScreen({ navigation, route }: Props) {
  const [clients, setClients] = useState<ExtendedClient[]>([]);
  const [selectedClient, setSelectedClient] = useState(route.params?.clientId || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [notes, setNotes] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const clientsList = await getAllClients();
    setClients(clientsList);
  };

  const parseDateTime = (dateStr: string, timeStr: string): Date | null => {
    try {
      // Formato esperado: DD/MM/YYYY y HH:MM
      const dateParts = dateStr.split('/');
      const timeParts = timeStr.split(':');
      
      if (dateParts.length !== 3 || timeParts.length !== 2) {
        return null;
      }

      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Mes en JS es 0-11
      const year = parseInt(dateParts[2]);
      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]);

      const appointmentDate = new Date(year, month, day, hours, minutes);
      
      // Validar que la fecha sea válida
      if (isNaN(appointmentDate.getTime())) {
        return null;
      }

      return appointmentDate;
    } catch (error) {
      return null;
    }
  };

  const handleSave = async () => {
    if (!selectedClient || !date || !time) {
      Alert.alert('Error', 'Por favor completá cliente, fecha y hora');
      return;
    }

    const appointmentDate = parseDateTime(date, time);
    if (!appointmentDate) {
      Alert.alert('Error', 'Formato de fecha u hora inválido. Usá DD/MM/YYYY y HH:MM');
      return;
    }

    // Validar que la fecha no sea en el pasado
    if (appointmentDate < new Date()) {
      Alert.alert('Error', 'No podés agendar una cita en el pasado');
      return;
    }

    const client = clients.find(c => c.id === selectedClient);
    if (!client) {
      Alert.alert('Error', 'Cliente no encontrado');
      return;
    }

    setLoading(true);
    try {
      const appointment = await createAppointment({
        clientId: client.id,
        clientName: client.fullName,
        date: appointmentDate,
        durationMinutes: parseInt(duration),
        status: 'pending',
        notes: notes.trim() || undefined,
        price: price ? parseFloat(price) : undefined,
      });

      // Programar notificación
      await scheduleAppointmentNotification(appointment);

      Alert.alert(
        '✅ Cita creada',
        `La cita con ${client.fullName} se creó correctamente para el ${appointmentDate.toLocaleDateString('es-AR')} a las ${appointmentDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}.\n\nRecibirás una notificación 1 hora antes.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creando cita:', error);
      Alert.alert('Error', 'No se pudo crear la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Selector de cliente */}
        <View style={styles.section}>
          <Text style={styles.label}>Cliente *</Text>
          {clients.length > 0 ? (
            <View style={styles.clientSelector}>
              {clients.map(client => (
                <TouchableOpacity
                  key={client.id}
                  style={[
                    styles.clientChip,
                    selectedClient === client.id && styles.clientChipSelected,
                  ]}
                  onPress={() => setSelectedClient(client.id)}
                  disabled={loading}
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
          ) : (
            <Text style={styles.emptyText}>No hay clientes aún</Text>
          )}
          <TouchableOpacity
            style={styles.newClientButton}
            onPress={() => navigation.navigate('NewClient')}
            disabled={loading}
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
            editable={!loading}
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
            editable={!loading}
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
                disabled={loading}
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
            editable={!loading}
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
            editable={!loading}
          />
        </View>

        {/* Info de notificación */}
        <View style={styles.notificationInfo}>
          <Text style={styles.notificationIcon}>🔔</Text>
          <Text style={styles.notificationText}>
            Recibirás una notificación 1 hora antes de la cita
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
              {loading ? 'Creando...' : 'Crear cita'}
            </Text>
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
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 12,
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
  notificationInfo: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  notificationText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
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
  buttonDisabled: {
    opacity: 0.6,
  },
});