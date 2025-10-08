import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,  
  SafeAreaView,
} from 'react-native';
import { mockAppointments, Appointment } from '../lib/mockData';

export default function CalendarScreen() {
  // Agrupar citas por día
  const appointmentsByDate = mockAppointments.reduce((acc, apt) => {
    const dateKey = new Date(apt.date).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(apt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const dates = Object.keys(appointmentsByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  const renderAppointment = (item: Appointment) => (
    <TouchableOpacity key={item.id} style={styles.appointmentCard}>
      <View style={styles.appointmentTime}>
        <Text style={styles.timeText}>
          {new Date(item.date).toLocaleTimeString('es-AR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
        <Text style={styles.durationText}>{item.durationMinutes}min</Text>
      </View>
      <View style={styles.appointmentInfo}>
        <Text style={styles.clientName}>{item.clientName}</Text>
        {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
        {item.price && (
          <Text style={styles.price}>${item.price.toLocaleString()}</Text>
        )}
      </View>
      <View style={[styles.statusIndicator, styles[`status${item.status}`]]} />
    </TouchableOpacity>
  );

  const renderDateSection = (dateKey: string) => {
    const date = new Date(dateKey);
    const appointments = appointmentsByDate[dateKey];

    return (
      <View key={dateKey} style={styles.dateSection}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateDay}>
            {date.toLocaleDateString('es-AR', { weekday: 'long' })}
          </Text>
          <Text style={styles.dateNumber}>
            {date.toLocaleDateString('es-AR', { 
              day: 'numeric', 
              month: 'long' 
            })}
          </Text>
        </View>
        {appointments.map(apt => renderAppointment(apt))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Agenda</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Nueva cita</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros rápidos */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
          <Text style={styles.filterChipTextActive}>Todas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterChipText}>Pendientes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterChipText}>Confirmadas</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de citas por fecha */}
      <ScrollView style={styles.scroll}>
        {dates.map(dateKey => renderDateSection(dateKey))}
        
        {dates.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📅</Text>
            <Text style={styles.emptyStateText}>No hay citas programadas</Text>
            <Text style={styles.emptyStateSubtext}>
              Agregá tu primera cita para comenzar
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Leyenda de estados */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
          <Text style={styles.legendText}>Pendiente</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
          <Text style={styles.legendText}>Confirmada</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
          <Text style={styles.legendText}>Completada</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterChipActive: {
    backgroundColor: '#000',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterChipTextActive: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  dateDay: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  appointmentCard: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  appointmentTime: {
    width: 70,
    marginRight: 12,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#666',
  },
  appointmentInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  statuspending: {
    backgroundColor: '#f59e0b',
  },
  statusconfirmed: {
    backgroundColor: '#10b981',
  },
  statuscompleted: {
    backgroundColor: '#3b82f6',
  },
  statuscancelled: {
    backgroundColor: '#ef4444',
  },
  emptyState: {
    padding: 64,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});