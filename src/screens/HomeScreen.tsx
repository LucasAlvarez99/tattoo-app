import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { mockAuth } from '../lib/mockAuth';
import { mockAppointments } from '../lib/mockData';

export default function HomeScreen() {
  const user = mockAuth.getUser();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayAppointments = mockAppointments.filter(apt => {
    const aptDate = new Date(apt.date);
    aptDate.setHours(0, 0, 0, 0);
    return aptDate.getTime() === today.getTime();
  });

  const upcomingAppointments = mockAppointments
    .filter(apt => new Date(apt.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const daysUntilTrialEnd = user?.trialEndsAt 
    ? Math.ceil((user.trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, {user?.fullName} 👋</Text>
            <Text style={styles.studioName}>{user?.studioName}</Text>
          </View>
        </View>

        {user?.subscriptionStatus === 'trial' && (
          <View style={styles.trialBanner}>
            <Text style={styles.trialTitle}>🎉 Período de prueba</Text>
            <Text style={styles.trialText}>
              Te quedan {daysUntilTrialEnd} días gratis
            </Text>
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{todayAppointments.length}</Text>
            <Text style={styles.statLabel}>Citas hoy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockAppointments.length}</Text>
            <Text style={styles.statLabel}>Total pendientes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              ${mockAppointments.reduce((sum, apt) => sum + (apt.price || 0), 0).toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Ingresos estimados</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agenda de hoy</Text>
          {todayAppointments.length > 0 ? (
            todayAppointments.map(apt => (
              <View key={apt.id} style={styles.appointmentCard}>
                <View style={styles.appointmentTime}>
                  <Text style={styles.appointmentTimeText}>
                    {new Date(apt.date).toLocaleTimeString('es-AR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </View>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentClient}>{apt.clientName}</Text>
                  <Text style={styles.appointmentNotes}>{apt.notes}</Text>
                  <Text style={styles.appointmentPrice}>${apt.price?.toLocaleString()}</Text>
                </View>
                <View style={[styles.statusBadge, apt.status === 'confirmed' ? styles.statusconfirmed : styles.statuspending]}>
                  <Text style={styles.statusText}>
                    {apt.status === 'confirmed' ? '✓' : '○'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No tenés citas para hoy</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximas citas</Text>
          {upcomingAppointments.map(apt => (
            <View key={apt.id} style={styles.upcomingCard}>
              <Text style={styles.upcomingDate}>
                {new Date(apt.date).toLocaleDateString('es-AR', { 
                  day: 'numeric', 
                  month: 'short' 
                })} - {new Date(apt.date).toLocaleTimeString('es-AR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
              <Text style={styles.upcomingClient}>{apt.clientName}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accesos rápidos</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>📅</Text>
              <Text style={styles.quickActionText}>Nueva cita</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>👤</Text>
              <Text style={styles.quickActionText}>Nuevo cliente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <Text style={styles.quickActionIcon}>💰</Text>
              <Text style={styles.quickActionText}>Cotizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  studioName: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  trialBanner: {
    backgroundColor: '#fef3c7',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  trialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 4,
  },
  trialText: {
    fontSize: 14,
    color: '#92400e',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  appointmentTime: {
    width: 60,
    marginRight: 12,
  },
  appointmentTimeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentClient: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  appointmentNotes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  appointmentPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusconfirmed: {
    backgroundColor: '#d1fae5',
  },
  statuspending: {
    backgroundColor: '#fed7aa',
  },
  statusText: {
    fontSize: 16,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
  },
  upcomingCard: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#000',
  },
  upcomingDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  upcomingClient: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});