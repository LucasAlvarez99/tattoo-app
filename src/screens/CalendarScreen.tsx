import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react';
import { mockAppointments, Appointment } from '../lib/mockData';
import SafeScreen from '../components/SafeScreen';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'list'>('month');

  // Obtener días del mes
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Obtener citas por fecha
  const getAppointmentsForDate = (date: Date | null) => {
    if (!date) return [];
    
    return mockAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return (
        aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Cambiar mes
  const changeMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const days = getDaysInMonth(selectedDate);
  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Agrupar citas por fecha para vista de lista
  const appointmentsByDate = mockAppointments.reduce((acc, apt) => {
    const dateKey = new Date(apt.date).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(apt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const sortedDates = Object.keys(appointmentsByDate).sort((a, b) => 
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
      </View>
      <View style={styles.appointmentInfo}>
        <Text style={styles.clientName}>{item.clientName}</Text>
        {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
        {item.price && (
          <Text style={styles.price}>${item.price.toLocaleString()}</Text>
        )}
      </View>
      <View style={[styles.statusDot, styles[`status${item.status}`]]} />
    </TouchableOpacity>
  );

  const renderDay = (day: Date | null, index: number) => {
    if (!day) {
      return <View key={`empty-${index}`} style={styles.dayCell} />;
    }

    const appointments = getAppointmentsForDate(day);
    const isToday = 
      day.getDate() === new Date().getDate() &&
      day.getMonth() === new Date().getMonth() &&
      day.getFullYear() === new Date().getFullYear();

    return (
      <TouchableOpacity
        key={day.toISOString()}
        style={[
          styles.dayCell,
          isToday && styles.todayCell,
          appointments.length > 0 && styles.dayCellWithAppointments,
        ]}
        onPress={() => {
          if (appointments.length > 0) {
            setSelectedDate(day);
            setView('list');
          }
        }}
      >
        <Text style={[
          styles.dayNumber,
          isToday && styles.todayNumber,
          appointments.length > 0 && styles.dayNumberWithAppointments,
        ]}>
          {day.getDate()}
        </Text>
        {appointments.length > 0 && (
          <View style={styles.appointmentDots}>
            {appointments.slice(0, 3).map((apt, i) => (
              <View 
                key={apt.id} 
                style={[
                  styles.appointmentDot,
                  { backgroundColor: apt.status === 'confirmed' ? '#10b981' : '#f59e0b' }
                ]} 
              />
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

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
              month: 'long',
              year: 'numeric'
            })}
          </Text>
        </View>
        {appointments.map(apt => renderAppointment(apt))}
      </View>
    );
  };

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Agenda</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Nueva cita</Text>
        </TouchableOpacity>
      </View>

      {/* Selector de vista */}
      <View style={styles.viewSelector}>
        <TouchableOpacity
          style={[styles.viewButton, view === 'month' && styles.viewButtonActive]}
          onPress={() => setView('month')}
        >
          <Text style={[styles.viewButtonText, view === 'month' && styles.viewButtonTextActive]}>
            📅 Mes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, view === 'list' && styles.viewButtonActive]}
          onPress={() => setView('list')}
        >
          <Text style={[styles.viewButtonText, view === 'list' && styles.viewButtonTextActive]}>
            📋 Lista
          </Text>
        </TouchableOpacity>
      </View>

      {view === 'month' ? (
        <>
          {/* Controles del mes */}
          <View style={styles.monthControls}>
            <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthButton}>
              <Text style={styles.monthButtonText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {selectedDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
            </Text>
            <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthButton}>
              <Text style={styles.monthButtonText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Días de la semana */}
          <View style={styles.weekDaysContainer}>
            {weekDays.map(day => (
              <Text key={day} style={styles.weekDay}>{day}</Text>
            ))}
          </View>

          {/* Calendario */}
          <ScrollView style={styles.calendarScroll} contentContainerStyle={styles.calendarContent}>
            <View style={styles.daysGrid}>
              {days.map((day, index) => renderDay(day, index))}
            </View>

            {/* Leyenda */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
                <Text style={styles.legendText}>Pendiente</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
                <Text style={styles.legendText}>Confirmada</Text>
              </View>
            </View>
          </ScrollView>
        </>
      ) : (
        <>
          {/* Vista de lista */}
          <ScrollView 
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
          >
            {sortedDates.map(dateKey => renderDateSection(dateKey))}
            
            {sortedDates.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📅</Text>
                <Text style={styles.emptyStateText}>No hay citas programadas</Text>
                <Text style={styles.emptyStateSubtext}>
                  Agregá tu primera cita para comenzar
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      )}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
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
  viewSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  viewButtonActive: {
    backgroundColor: '#000',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  viewButtonTextActive: {
    color: '#fff',
  },
  monthControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  monthButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthButtonText: {
    fontSize: 24,
    color: '#000',
    fontWeight: '600',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textTransform: 'capitalize',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  calendarScroll: {
    flex: 1,
  },
  calendarContent: {
    paddingBottom: 100,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  todayCell: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  dayCellWithAppointments: {
    backgroundColor: '#f0f9ff',
  },
  dayNumber: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  todayNumber: {
    fontWeight: '700',
    color: '#92400e',
  },
  dayNumberWithAppointments: {
    fontWeight: '700',
  },
  appointmentDots: {
    flexDirection: 'row',
    marginTop: 2,
    gap: 2,
  },
  appointmentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 16,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
    alignItems: 'center',
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
  statusDot: {
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
});