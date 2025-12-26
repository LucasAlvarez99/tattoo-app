import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { getAllAppointments } from '../lib/appointmentService';
import { getAllClients } from '../lib/clientService';
import { getStudioData } from '../lib/studioService';
import { Appointment } from '../lib/types';
import { ExtendedClient } from '../lib/clientService';
import { StudioData } from '../lib/studioService';
import SafeScreen from '../components/SafeScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'ExportPDF'>;
type ExportPeriod = 'today' | 'week' | 'month' | 'all';
type ExportType = 'agenda' | 'clients';

export default function ExportPDFScreen({ navigation }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState<ExportPeriod>('month');
  const [exportType, setExportType] = useState<ExportType>('agenda');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<ExtendedClient[]>([]);
  const [studioData, setStudioData] = useState<StudioData | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [appointmentsData, clientsData, studio] = await Promise.all([
        getAllAppointments(),
        getAllClients(),
        getStudioData(),
      ]);
      
      setAppointments(appointmentsData);
      setClients(clientsData);
      setStudioData(studio);
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentsByPeriod = (period: ExportPeriod): Appointment[] => {
    const now = new Date();
    
    switch (period) {
      case 'today':
        const today = new Date(now.setHours(0, 0, 0, 0));
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return appointments.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate >= today && aptDate < tomorrow;
        });
      
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        return appointments.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate >= weekStart && aptDate < weekEnd;
        });
      
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        monthEnd.setHours(23, 59, 59, 999);
        return appointments.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate >= monthStart && aptDate <= monthEnd;
        });
      
      case 'all':
        return appointments;
      
      default:
        return [];
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);

    // TODO: En producción, descomentar esto y instalar react-native-html-to-pdf
    /*
    try {
      const htmlContent = exportType === 'agenda' 
        ? generateAgendaHTML()
        : generateClientsHTML();

      const options = {
        html: htmlContent,
        fileName: `${exportType === 'agenda' ? 'Agenda' : 'Clientes'}_${selectedPeriod}_${Date.now()}`,
        directory: 'Documents',
        base64: true,
      };

      const file = await RNHTMLtoPDF.convert(options);
      
      await Share.open({
        url: `file://${file.filePath}`,
        type: 'application/pdf',
        title: 'Compartir PDF',
      });

      Alert.alert('✅ PDF Generado', `Archivo guardado en: ${file.filePath}`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF');
    }
    */

    // SIMULACIÓN para desarrollo
    setTimeout(() => {
      const count = exportType === 'agenda' 
        ? getAppointmentsByPeriod(selectedPeriod).length
        : clients.length;
      
      Alert.alert(
        '✅ PDF Generado (Simulación)',
        `Se exportarían ${count} ${exportType === 'agenda' ? 'citas' : 'clientes'}.\n\n📝 Para producción:\n1. Instalar: react-native-html-to-pdf\n2. Instalar: react-native-share\n3. Descomentar código en ExportPDFScreen.tsx`,
        [{ text: 'OK' }]
      );
      setIsGenerating(false);
    }, 2000);
  };

  const periods = [
    { id: 'today' as ExportPeriod, label: 'Hoy', icon: '📅', description: 'Citas de hoy' },
    { id: 'week' as ExportPeriod, label: 'Esta semana', icon: '📆', description: '7 días' },
    { id: 'month' as ExportPeriod, label: 'Este mes', icon: '🗓️', description: 'Mes actual' },
    { id: 'all' as ExportPeriod, label: 'Todo', icon: '📚', description: 'Todas las citas' },
  ];

  const selectedAppointments = getAppointmentsByPeriod(selectedPeriod);
  const totalRevenue = selectedAppointments
    .filter(apt => apt.status === 'completed')
    .reduce((sum, apt) => sum + (apt.price || 0), 0);

  // Calcular stats de clientes
  const clientRevenue: Record<string, number> = {};
  appointments.forEach(apt => {
    if (apt.status === 'completed' && apt.price) {
      clientRevenue[apt.clientId] = (clientRevenue[apt.clientId] || 0) + apt.price;
    }
  });
  const totalClientRevenue = Object.values(clientRevenue).reduce((sum, val) => sum + val, 0);
  const totalSessions = clients.reduce((sum, c) => sum + c.totalSessions, 0);

  if (loading) {
    return (
      <SafeScreen edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>‹ Atrás</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Exportar a PDF</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exportar a PDF</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>📄</Text>
          <Text style={styles.infoText}>
            Generá un PDF profesional para imprimir o compartir
          </Text>
        </View>

        {/* Tipo de exportación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de exportación</Text>
          <View style={styles.typeGrid}>
            <TouchableOpacity
              style={[
                styles.typeCard,
                exportType === 'agenda' && styles.typeCardSelected,
              ]}
              onPress={() => setExportType('agenda')}
            >
              <Text style={styles.typeIcon}>📅</Text>
              <Text
                style={[
                  styles.typeLabel,
                  exportType === 'agenda' && styles.typeLabelSelected,
                ]}
              >
                Agenda
              </Text>
              <Text style={styles.typeDescription}>Citas por período</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeCard,
                exportType === 'clients' && styles.typeCardSelected,
              ]}
              onPress={() => setExportType('clients')}
            >
              <Text style={styles.typeIcon}>👥</Text>
              <Text
                style={[
                  styles.typeLabel,
                  exportType === 'clients' && styles.typeLabelSelected,
                ]}
              >
                Clientes
              </Text>
              <Text style={styles.typeDescription}>Base de datos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Selector de período (solo para agenda) */}
        {exportType === 'agenda' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seleccioná el período</Text>
            <View style={styles.periodsGrid}>
              {periods.map(period => (
                <TouchableOpacity
                  key={period.id}
                  style={[
                    styles.periodCard,
                    selectedPeriod === period.id && styles.periodCardSelected,
                  ]}
                  onPress={() => setSelectedPeriod(period.id)}
                >
                  <Text style={styles.periodIcon}>{period.icon}</Text>
                  <Text
                    style={[
                      styles.periodLabel,
                      selectedPeriod === period.id && styles.periodLabelSelected,
                    ]}
                  >
                    {period.label}
                  </Text>
                  <Text style={styles.periodDescription}>{period.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Preview/Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vista previa</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>
                {exportType === 'agenda' 
                  ? periods.find(p => p.id === selectedPeriod)?.label 
                  : 'Base de Clientes'}
              </Text>
              <Text style={styles.previewDate}>
                {new Date().toLocaleDateString('es-AR')}
              </Text>
            </View>

            {exportType === 'agenda' ? (
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{selectedAppointments.length}</Text>
                  <Text style={styles.statLabel}>Citas</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {selectedAppointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length}
                  </Text>
                  <Text style={styles.statLabel}>Pendientes</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    ${Math.floor(totalRevenue / 1000)}k
                  </Text>
                  <Text style={styles.statLabel}>Facturado</Text>
                </View>
              </View>
            ) : (
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{clients.length}</Text>
                  <Text style={styles.statLabel}>Clientes</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {clients.filter(c => c.totalSessions > 0).length}
                  </Text>
                  <Text style={styles.statLabel}>Activos</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{totalSessions}</Text>
                  <Text style={styles.statLabel}>Sesiones</Text>
                </View>
              </View>
            )}

            <View style={styles.previewInfo}>
              <Text style={styles.previewInfoTitle}>El PDF incluirá:</Text>
              {exportType === 'agenda' ? (
                <>
                  <Text style={styles.previewInfoItem}>✓ Información del estudio</Text>
                  <Text style={styles.previewInfoItem}>✓ Estadísticas del período</Text>
                  <Text style={styles.previewInfoItem}>✓ Listado completo de citas</Text>
                  <Text style={styles.previewInfoItem}>✓ Detalles de cada cliente</Text>
                  <Text style={styles.previewInfoItem}>✓ Precios y estado de pago</Text>
                </>
              ) : (
                <>
                  <Text style={styles.previewInfoItem}>✓ Listado completo de clientes</Text>
                  <Text style={styles.previewInfoItem}>✓ Datos de contacto</Text>
                  <Text style={styles.previewInfoItem}>✓ Cantidad de sesiones</Text>
                  <Text style={styles.previewInfoItem}>✓ Total gastado por cliente</Text>
                  <Text style={styles.previewInfoItem}>✓ Fecha de registro</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Botón generar */}
        <TouchableOpacity
          style={[styles.generateButton, (isGenerating || (exportType === 'agenda' && selectedAppointments.length === 0)) && styles.generateButtonDisabled]}
          onPress={generatePDF}
          disabled={isGenerating || (exportType === 'agenda' && selectedAppointments.length === 0)}
        >
          <Text style={styles.generateButtonText}>
            {isGenerating
              ? '⏳ Generando PDF...'
              : exportType === 'agenda' && selectedAppointments.length === 0
              ? '📄 Sin citas para exportar'
              : '📄 Generar PDF'}
          </Text>
        </TouchableOpacity>

        {exportType === 'agenda' && selectedAppointments.length === 0 && (
          <Text style={styles.emptyText}>
            No hay citas en el período seleccionado
          </Text>
        )}

        <View style={{ height: 40 }} />
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
  backButton: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#0369a1',
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  typeCardSelected: {
    borderColor: '#000',
    backgroundColor: '#f9fafb',
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  typeLabelSelected: {
    color: '#000',
  },
  typeDescription: {
    fontSize: 11,
    color: '#999',
  },
  periodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  periodCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  periodCardSelected: {
    borderColor: '#000',
    backgroundColor: '#f9fafb',
  },
  periodIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  periodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  periodLabelSelected: {
    color: '#000',
  },
  periodDescription: {
    fontSize: 11,
    color: '#999',
  },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  previewDate: {
    fontSize: 12,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
  },
  previewInfo: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
  },
  previewInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  previewInfoItem: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  generateButton: {
    backgroundColor: '#000',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 12,
  },
});