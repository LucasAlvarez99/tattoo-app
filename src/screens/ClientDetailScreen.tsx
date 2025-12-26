import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { getClientById, ExtendedClient } from '../lib/clientService';
import { getAppointmentsByClient } from '../lib/appointmentService';
import { Appointment } from '../lib/types';
import SafeScreen from '../components/SafeScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'ClientDetail'>;

export default function ClientDetailScreen({ route, navigation }: Props) {
  const { clientId } = route.params;
  
  const [client, setClient] = useState<ExtendedClient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');

  useFocusEffect(
    useCallback(() => {
      loadClientData();
    }, [clientId])
  );

  const loadClientData = async () => {
    setLoading(true);
    try {
      const clientData = await getClientById(clientId);
      const appointmentsData = await getAppointmentsByClient(clientId);
      
      setClient(clientData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error cargando datos del cliente:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del cliente');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeScreen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Cargando cliente...</Text>
        </View>
      </SafeScreen>
    );
  }

  if (!client) {
    return (
      <SafeScreen>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Cliente no encontrado</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${client.phone}`).catch(() => {
      Alert.alert('Error', 'No se pudo abrir la aplicación de teléfono');
    });
  };

  const handleWhatsApp = () => {
    const phoneNumber = client.phone.replace(/[\s-]/g, '');
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'No se pudo abrir WhatsApp');
    });
  };

  const handleEmail = () => {
    if (client.email) {
      Linking.openURL(`mailto:${client.email}`).catch(() => {
        Alert.alert('Error', 'No se pudo abrir el cliente de email');
      });
    }
  };

  const handleInstagram = () => {
    if (client.instagram) {
      const username = client.instagram.replace('@', '');
      Linking.openURL(`instagram://user?username=${username}`).catch(() => {
        Linking.openURL(`https://instagram.com/${username}`);
      });
    }
  };

  const totalSpent = appointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + (a.price || 0), 0);

  const upcomingAppointments = appointments.filter(
    a => new Date(a.date) > new Date() && a.status !== 'cancelled'
  );

  const completedSessions = appointments.filter(
    a => a.status === 'completed'
  ).length;

  const renderAppointment = (appointment: Appointment) => {
    const date = new Date(appointment.date);
    const isPast = date < new Date();
    
    let statusColor = '#f59e0b';
    let statusText = 'Pendiente';
    
    if (appointment.status === 'confirmed') {
      statusColor = '#10b981';
      statusText = 'Confirmada';
    } else if (appointment.status === 'completed') {
      statusColor = '#3b82f6';
      statusText = 'Completada';
    } else if (appointment.status === 'cancelled') {
      statusColor = '#ef4444';
      statusText = 'Cancelada';
    }

    return (
      <View key={appointment.id} style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <View>
            <Text style={styles.appointmentDate}>
              {date.toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            <Text style={styles.appointmentTime}>
              {date.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusBadgeText}>{statusText}</Text>
          </View>
        </View>

        {appointment.notes && (
          <Text style={styles.appointmentNotes}>{appointment.notes}</Text>
        )}

        {appointment.price && (
          <Text style={styles.appointmentPrice}>
            ${appointment.price.toLocaleString()}
          </Text>
        )}

        {!isPast && appointment.status !== 'cancelled' && (
          <TouchableOpacity style={styles.appointmentActionButton}>
            <Text style={styles.appointmentActionText}>Ver detalles</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonHeader}>‹ Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Cliente</Text>
        <TouchableOpacity onPress={() => Alert.alert('Editar', 'Función próximamente')}>
          <Text style={styles.editButton}>Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar y nombre */}
      <View style={styles.clientHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {client.fullName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.clientName}>{client.fullName}</Text>
        <Text style={styles.clientSince}>
          Cliente desde {new Date(client.createdAt).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{completedSessions}</Text>
          <Text style={styles.statLabel}>Sesiones</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>${Math.floor(totalSpent / 1000)}k</Text>
          <Text style={styles.statLabel}>Gastado</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{upcomingAppointments.length}</Text>
          <Text style={styles.statLabel}>Próximas</Text>
        </View>
      </View>

      {/* Acciones rápidas */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <Text style={styles.actionIcon}>📞</Text>
          <Text style={styles.actionText}>Llamar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleWhatsApp}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>WhatsApp</Text>
        </TouchableOpacity>

        {client.email && (
          <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
            <Text style={styles.actionIcon}>📧</Text>
            <Text style={styles.actionText}>Email</Text>
          </TouchableOpacity>
        )}

        {client.instagram && (
          <TouchableOpacity style={styles.actionButton} onPress={handleInstagram}>
            <Text style={styles.actionIcon}>📷</Text>
            <Text style={styles.actionText}>Instagram</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'info' && styles.tabActive]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={[styles.tabText, activeTab === 'info' && styles.tabTextActive]}>
            Información
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            Historial ({appointments.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'info' ? (
          <View>
            {/* Información de contacto */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contacto</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{client.phone}</Text>
              </View>

              {client.email && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{client.email}</Text>
                </View>
              )}

              {client.instagram && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Instagram</Text>
                  <Text style={styles.infoValue}>{client.instagram}</Text>
                </View>
              )}
            </View>

            {/* Notas */}
            {client.notes && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notas</Text>
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>{client.notes}</Text>
                </View>
              </View>
            )}

            {/* Botón nueva cita */}
            <TouchableOpacity
              style={styles.newAppointmentButton}
              onPress={() => navigation.navigate('NewAppointment', { clientId: client.id })}
            >
              <Text style={styles.newAppointmentButtonText}>
                📅 Agendar nueva cita
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {appointments.length > 0 ? (
              <>
                <Text style={styles.historyTitle}>
                  {appointments.length} {appointments.length === 1 ? 'cita' : 'citas'} en total
                </Text>
                {appointments
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(apt => renderAppointment(apt))}
              </>
            ) : (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyHistoryIcon}>📅</Text>
                <Text style={styles.emptyHistoryText}>Sin historial aún</Text>
                <Text style={styles.emptyHistorySubtext}>
                  Este cliente no tiene citas registradas
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButtonHeader: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  editButton: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '600',
  },
  clientHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '600',
  },
  clientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  clientSince: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#000',
  },
  content: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    paddingBottom: 100,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  notesBox: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  newAppointmentButton: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    backgroundColor: '#000',
    borderRadius: 12,
    alignItems: 'center',
  },
  newAppointmentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  appointmentNotes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  appointmentPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 12,
  },
  appointmentActionButton: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  appointmentActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  emptyHistory: {
    padding: 48,
    alignItems: 'center',
  },
  emptyHistoryIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyHistoryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});