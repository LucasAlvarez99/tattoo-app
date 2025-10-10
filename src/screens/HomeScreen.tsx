import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from '../types/navigation';
import { mockAuth } from '../lib/mockAuth';
import { 
  getTodayAppointments, 
  getUpcomingAppointments, 
  getPendingAppointments 
} from '../lib/mockData';
import SafeScreen from '../components/SafeScreen';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'HomeTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const user = mockAuth.getUser();
  
  const todayAppointments = getTodayAppointments();
  const upcomingAppointments = getUpcomingAppointments(3);
  const pendingAppointments = getPendingAppointments();

  const daysUntilTrialEnd = user?.trialEndsAt 
    ? Math.ceil((user.trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      <ScrollView 
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header compacto */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting} numberOfLines={1}>
              Hola, {user?.fullName?.split(' ')[0] || 'Usuario'} 👋
            </Text>
            <Text style={styles.studioName} numberOfLines={1}>
              {user?.studioName}
            </Text>
          </View>
        </View>

        {/* Estado de suscripción */}
        {user?.subscriptionStatus === 'trial' && (
          <View style={styles.trialBanner}>
            <Text style={styles.trialTitle}>🎉 Prueba gratis</Text>
            <Text style={styles.trialText}>
              {daysUntilTrialEnd} días restantes
            </Text>
          </View>
        )}

        {/* Estadísticas compactas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{todayAppointments.length}</Text>
            <Text style={styles.statLabel}>Hoy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockAppointments.length}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              ${Math.floor(mockAppointments.reduce((sum, apt) => sum + (apt.price || 0), 0) / 1000)}k
            </Text>
            <Text style={styles.statLabel}>Estimado</Text>
          </View>
        </View>

        {/* Citas de hoy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoy</Text>
          {todayAppointments.length > 0 ? (
            todayAppointments.map(apt => (
              <View key={apt.id} style={styles.appointmentCard}>
                <Text style={styles.timeText}>
                  {new Date(apt.date).toLocaleTimeString('es-AR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.clientName} numberOfLines={1}>
                    {apt.clientName}
                  </Text>
                  <Text style={styles.price}>${apt.price?.toLocaleString()}</Text>
                </View>
                <View style={[styles.badge, apt.status === 'confirmed' ? styles.badgeConfirmed : styles.badgePending]}>
                  <Text style={styles.badgeText}>
                    {apt.status === 'confirmed' ? '✓' : '○'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Sin citas hoy</Text>
          )}
        </View>

        {/* Próximas citas */}
        {upcomingAppointments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Próximas</Text>
            {upcomingAppointments.map(apt => (
              <View key={apt.id} style={styles.upcomingCard}>
                <Text style={styles.upcomingDate}>
                  {new Date(apt.date).toLocaleDateString('es-AR', { 
                    day: 'numeric', 
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
                <Text style={styles.upcomingClient} numberOfLines={1}>
                  {apt.clientName}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Accesos rápidos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => navigation.navigate('NewAppointment', {})}
            >
              <Text style={styles.quickActionIcon}>📅</Text>
              <Text style={styles.quickActionText}>Nueva{'\n'}cita</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => navigation.navigate('NewClient')}
            >
              <Text style={styles.quickActionIcon}>👤</Text>
              <Text style={styles.quickActionText}>Nuevo{'\n'}cliente</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => navigation.navigate('QuoteScreen')}
            >
              <Text style={styles.quickActionIcon}>💰</Text>
              <Text style={styles.quickActionText}>Cotizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  studioName: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  trialBanner: {
    backgroundColor: '#fef3c7',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  trialTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  trialText: {
    fontSize: 12,
    color: '#92400e',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    width: 50,
  },
  appointmentInfo: {
    flex: 1,
    marginLeft: 8,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  price: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '500',
    marginTop: 2,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeConfirmed: {
    backgroundColor: '#d1fae5',
  },
  badgePending: {
    backgroundColor: '#fed7aa',
  },
  badgeText: {
    fontSize: 14,
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  upcomingCard: {
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#000',
  },
  upcomingDate: {
    fontSize: 11,
    color: '#666',
  },
  upcomingClient: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 13,
  },
});