import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { mockAppointments, mockStudioData, Appointment } from '../lib/mockData';
import SafeScreen from '../components/SafeScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'ExportPDF'>;

type ExportPeriod = 'today' | 'week' | 'month' | 'all';

export default function ExportPDFScreen({ navigation }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState<ExportPeriod>('month');
  const [isGenerating, setIsGenerating] = useState(false);

  const getAppointmentsByPeriod = (period: ExportPeriod): Appointment[] => {
    const now = new Date();
    
    switch (period) {
      case 'today':
        const today = new Date(now.setHours(0, 0, 0, 0));
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return mockAppointments.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate >= today && aptDate < tomorrow;
        });
      
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        return mockAppointments.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate >= weekStart && aptDate < weekEnd;
        });
      
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        monthEnd.setHours(23, 59, 59, 999);
        return mockAppointments.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate >= monthStart && aptDate <= monthEnd;
        });
      
      case 'all':
        return mockAppointments;
      
      default:
        return [];
    }
  };

  const generateHTMLContent = (appointments: Appointment[]): string => {
    const sortedAppointments = [...appointments].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const totalRevenue = sortedAppointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => sum + (apt.price || 0), 0);

    const confirmedCount = sortedAppointments.filter(apt => apt.status === 'confirmed').length;
    const pendingCount = sortedAppointments.filter(apt => apt.status === 'pending').length;
    const completedCount = sortedAppointments.filter(apt => apt.status === 'completed').length;

    const periodText = {
      today: 'Hoy',
      week: 'Esta semana',
      month: 'Este mes',
      all: 'Todas las citas',
    }[selectedPeriod];

    let appointmentsHTML = '';
    sortedAppointments.forEach(apt => {
      const date = new Date(apt.date);
      const statusColor = {
        pending: '#f59e0b',
        confirmed: '#10b981',
        completed: '#3b82f6',
        cancelled: '#ef4444',
      }[apt.status];

      const statusText = {
        pending: 'Pendiente',
        confirmed: 'Confirmada',
        completed: 'Completada',
        cancelled: 'Cancelada',
      }[apt.status];

      appointmentsHTML += `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; font-size: 14px;">
            <strong>${date.toLocaleDateString('es-AR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}</strong><br/>
            <span style="color: #666; font-size: 12px;">
              ${date.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </td>
          <td style="padding: 12px;">
            <strong style="font-size: 14px;">${apt.clientName}</strong><br/>
            ${apt.notes ? `<span style="color: #666; font-size: 12px;">${apt.notes}</span>` : ''}
          </td>
          <td style="padding: 12px; text-align: center;">
            <span style="background-color: ${statusColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
              ${statusText}
            </span>
          </td>
          <td style="padding: 12px; text-align: right; font-weight: 600; color: #059669; font-size: 14px;">
            ${apt.price ? `$${apt.price.toLocaleString()}` : '-'}
          </td>
        </tr>
      `;
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 40px;
            background: white;
            color: #000;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #000;
          }
          .header h1 {
            font-size: 32px;
            margin-bottom: 8px;
          }
          .header p {
            color: #666;
            font-size: 14px;
          }
          .studio-info {
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            font-size: 12px;
            color: #666;
          }
          .stats {
            display: flex;
            justify-content: space-around;
            margin-bottom: 32px;
            gap: 16px;
          }
          .stat-card {
            flex: 1;
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e5e7eb;
          }
          .stat-number {
            font-size: 28px;
            font-weight: bold;
            color: #000;
            margin-bottom: 4px;
          }
          .stat-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 24px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
          }
          thead {
            background: #f9fafb;
          }
          th {
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #e5e7eb;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #999;
            font-size: 11px;
          }
          .footer p {
            margin: 4px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${mockStudioData.name}</h1>
          <p>Agenda de citas - ${periodText}</p>
          <p style="margin-top: 8px; font-size: 12px;">
            Generado el ${new Date().toLocaleDateString('es-AR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <div class="studio-info">
          <strong>${mockStudioData.name}</strong><br/>
          📍 ${mockStudioData.address}<br/>
          📞 ${mockStudioData.phone}<br/>
          📧 ${mockStudioData.email}<br/>
          📷 ${mockStudioData.instagram}
        </div>

        <div class="stats">
          <div class="stat-card">
            <div class="stat-number">${sortedAppointments.length}</div>
            <div class="stat-label">Total Citas</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${confirmedCount + pendingCount}</div>
            <div class="stat-label">Pendientes</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${completedCount}</div>
            <div class="stat-label">Completadas</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">$${Math.floor(totalRevenue / 1000)}k</div>
            <div class="stat-label">Facturado</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Cliente</th>
              <th style="text-align: center;">Estado</th>
              <th style="text-align: right;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${appointmentsHTML}
          </tbody>
        </table>

        ${
          sortedAppointments.length === 0
            ? '<p style="text-align: center; padding: 40px; color: #999;">No hay citas en este período</p>'
            : ''
        }

        <div class="footer">
          <p><strong>${mockStudioData.name}</strong></p>
          <p>${mockStudioData.address}</p>
          <p>${mockStudioData.phone} • ${mockStudioData.email}</p>
          <p style="margin-top: 8px; font-size: 10px;">
            Documento generado automáticamente por Tattoo Manager
          </p>
        </div>
      </body>
      </html>
    `;
  };

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      const appointments = getAppointmentsByPeriod(selectedPeriod);
      
      if (appointments.length === 0) {
        Alert.alert(
          'Sin citas',
          'No hay citas en el período seleccionado para exportar.'
        );
        setIsGenerating(false);
        return;
      }

      const htmlContent = generateHTMLContent(appointments);

      // Simulación de generación de PDF
      // En producción, usarías react-native-html-to-pdf o similar
      
      // NOTA: Para implementación real, descomenta esto y agrega react-native-html-to-pdf:
      /*
      const options = {
        html: htmlContent,
        fileName: `Agenda_${selectedPeriod}_${Date.now()}`,
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      
      Alert.alert(
        '✅ PDF Generado',
        'El archivo se guardó correctamente',
        [
          { text: 'Ver', onPress: () => FileViewer.open(file.filePath) },
          { text: 'Compartir', onPress: () => sharePDF(file.filePath) },
          { text: 'OK' },
        ]
      );
      */

      // Simulación:
      setTimeout(() => {
        Alert.alert(
          '✅ PDF Generado',
          `Se exportaron ${appointments.length} citas correctamente`,
          [
            {
              text: 'Compartir',
              onPress: () => sharePDFSimulation(appointments.length),
            },
            { text: 'OK' },
          ]
        );
        setIsGenerating(false);
      }, 2000);

    } catch (error) {
      console.error('Error generando PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF');
      setIsGenerating(false);
    }
  };

  const sharePDFSimulation = async (count: number) => {
    try {
      await Share.share({
        message: `📅 Agenda ${mockStudioData.name}\n\n${count} citas exportadas\n\nGenerado con Tattoo Manager`,
        title: 'Agenda de citas',
      });
    } catch (error) {
      console.error('Error compartiendo:', error);
    }
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
            Generá un PDF profesional de tu agenda para imprimir o compartir
          </Text>
        </View>

        {/* Selector de período */}
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

        {/* Preview/Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vista previa</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>
                {periods.find(p => p.id === selectedPeriod)?.label}
              </Text>
              <Text style={styles.previewDate}>
                {new Date().toLocaleDateString('es-AR')}
              </Text>
            </View>

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

            <View style={styles.previewInfo}>
              <Text style={styles.previewInfoTitle}>El PDF incluirá:</Text>
              <Text style={styles.previewInfoItem}>✓ Información del estudio</Text>
              <Text style={styles.previewInfoItem}>✓ Estadísticas del período</Text>
              <Text style={styles.previewInfoItem}>✓ Listado completo de citas</Text>
              <Text style={styles.previewInfoItem}>✓ Detalles de cada cliente</Text>
              <Text style={styles.previewInfoItem}>✓ Precios y estado de pago</Text>
            </View>
          </View>
        </View>

        {/* Botón generar */}
        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
          onPress={generatePDF}
          disabled={isGenerating || selectedAppointments.length === 0}
        >
          <Text style={styles.generateButtonText}>
            {isGenerating
              ? '⏳ Generando PDF...'
              : selectedAppointments.length === 0
              ? '📄 Sin citas para exportar'
              : '📄 Generar PDF'}
          </Text>
        </TouchableOpacity>

        {selectedAppointments.length === 0 && (
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