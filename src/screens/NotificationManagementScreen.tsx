import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import {
  NOTIFICATION_CONFIG,
  testNotification,
  NotificationChannel,
  getScheduledNotifications,
  startNotificationScheduler,
  stopNotificationScheduler,
} from '../lib/notificationService';
import SafeScreen from '../components/SafeScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationManagement'>;

export default function NotificationManagementScreen({ navigation }: Props) {
  const [testPhone, setTestPhone] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testInstagram, setTestInstagram] = useState('');
  const [testMessage, setTestMessage] = useState('Hola! Este es un mensaje de prueba desde Tattoo Manager 🎨');
  const [isTesting, setIsTesting] = useState(false);
  const [schedulerEnabled, setSchedulerEnabled] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  useEffect(() => {
    // Iniciar scheduler al montar el componente
    if (schedulerEnabled) {
      startNotificationScheduler();
    }
    return () => {
      stopNotificationScheduler();
    };
  }, [schedulerEnabled]);

  const handleTest = async (channel: NotificationChannel) => {
    const testData = {
      phone: testPhone,
      email: testEmail,
      instagram: testInstagram,
    };

    // Validaciones
    if (channel === 'whatsapp' && !testPhone) {
      Alert.alert('Error', 'Ingresá un número de teléfono');
      return;
    }
    if (channel === 'email' && !testEmail) {
      Alert.alert('Error', 'Ingresá un email');
      return;
    }
    if (channel === 'instagram' && !testInstagram) {
      Alert.alert('Error', 'Ingresá un usuario de Instagram');
      return;
    }

    setIsTesting(true);
    const result = await testNotification(channel, testMessage, testData);
    setIsTesting(false);

    if (result.success) {
      Alert.alert(
        '✅ Mensaje enviado',
        `El mensaje de prueba se envió correctamente por ${channel}`
      );
    } else {
      Alert.alert(
        '❌ Error',
        result.error || 'No se pudo enviar el mensaje'
      );
    }
  };

  const scheduledNotifications = getScheduledNotifications();
  const pendingCount = scheduledNotifications.filter(n => n.status === 'scheduled').length;
  const sentCount = scheduledNotifications.filter(n => n.status === 'sent').length;

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mensajes Automáticos</Text>
        <TouchableOpacity onPress={() => setShowConfigModal(true)}>
          <Text style={styles.configButton}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Estado del sistema */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Sistema de envíos</Text>
            <Switch
              value={schedulerEnabled}
              onValueChange={setSchedulerEnabled}
            />
          </View>
          <Text style={styles.statusDescription}>
            {schedulerEnabled
              ? '✅ El sistema está revisando y enviando mensajes automáticamente'
              : '⏸️ El sistema está pausado. Activalo para enviar mensajes'}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Programados</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{sentCount}</Text>
              <Text style={styles.statLabel}>Enviados</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {scheduledNotifications.filter(n => n.status === 'failed').length}
              </Text>
              <Text style={styles.statLabel}>Fallidos</Text>
            </View>
          </View>
        </View>

        {/* Estado de APIs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado de Integraciones</Text>
          
          <View style={styles.apiCard}>
            <View style={styles.apiHeader}>
              <Text style={styles.apiIcon}>📱</Text>
              <View style={styles.apiInfo}>
                <Text style={styles.apiName}>WhatsApp (Twilio)</Text>
                <Text style={styles.apiStatus}>
                  {NOTIFICATION_CONFIG.whatsapp.enabled ? (
                    <Text style={styles.apiStatusActive}>✅ Configurado</Text>
                  ) : (
                    <Text style={styles.apiStatusInactive}>⚠️ No configurado</Text>
                  )}
                </Text>
              </View>
            </View>
            <Text style={styles.apiDescription}>
              {NOTIFICATION_CONFIG.whatsapp.enabled
                ? 'Los mensajes se envían automáticamente'
                : 'Abre WhatsApp manualmente. Configura Twilio para envíos automáticos'}
            </Text>
          </View>

          <View style={styles.apiCard}>
            <View style={styles.apiHeader}>
              <Text style={styles.apiIcon}>📧</Text>
              <View style={styles.apiInfo}>
                <Text style={styles.apiName}>Email (SendGrid)</Text>
                <Text style={styles.apiStatus}>
                  {NOTIFICATION_CONFIG.email.enabled ? (
                    <Text style={styles.apiStatusActive}>✅ Configurado</Text>
                  ) : (
                    <Text style={styles.apiStatusInactive}>⚠️ No configurado</Text>
                  )}
                </Text>
              </View>
            </View>
            <Text style={styles.apiDescription}>
              {NOTIFICATION_CONFIG.email.enabled
                ? 'Los emails se envían automáticamente'
                : 'Abre cliente de email. Configura SendGrid para envíos automáticos'}
            </Text>
          </View>

          <View style={styles.apiCard}>
            <View style={styles.apiHeader}>
              <Text style={styles.apiIcon}>📷</Text>
              <View style={styles.apiInfo}>
                <Text style={styles.apiName}>Instagram</Text>
                <Text style={styles.apiStatus}>
                  <Text style={styles.apiStatusWarning}>⚠️ Manual</Text>
                </Text>
              </View>
            </View>
            <Text style={styles.apiDescription}>
              Instagram no permite envíos automáticos. Solo abre la app para envío manual
            </Text>
          </View>
        </View>

        {/* Testing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Probar envíos</Text>

          <View style={styles.testCard}>
            <Text style={styles.testCardTitle}>Mensaje de prueba</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Escribe tu mensaje de prueba..."
              placeholderTextColor="#999"
              value={testMessage}
              onChangeText={setTestMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Text style={styles.inputLabel}>WhatsApp - Número de prueba</Text>
            <TextInput
              style={styles.input}
              placeholder="+54 9 11 1234-5678"
              placeholderTextColor="#999"
              value={testPhone}
              onChangeText={setTestPhone}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => handleTest('whatsapp')}
              disabled={isTesting}
            >
              <Text style={styles.testButtonText}>
                📱 Probar WhatsApp
              </Text>
            </TouchableOpacity>

            <Text style={styles.inputLabel}>Email - Correo de prueba</Text>
            <TextInput
              style={styles.input}
              placeholder="prueba@email.com"
              placeholderTextColor="#999"
              value={testEmail}
              onChangeText={setTestEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => handleTest('email')}
              disabled={isTesting}
            >
              <Text style={styles.testButtonText}>
                📧 Probar Email
              </Text>
            </TouchableOpacity>

            <Text style={styles.inputLabel}>Instagram - Usuario de prueba</Text>
            <TextInput
              style={styles.input}
              placeholder="@usuario"
              placeholderTextColor="#999"
              value={testInstagram}
              onChangeText={setTestInstagram}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => handleTest('instagram')}
              disabled={isTesting}
            >
              <Text style={styles.testButtonText}>
                📷 Probar Instagram
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info de configuración */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>
              <Text style={styles.infoTextBold}>Modo actual: </Text>
              {!NOTIFICATION_CONFIG.whatsapp.enabled && !NOTIFICATION_CONFIG.email.enabled
                ? 'Desarrollo (abre apps manualmente)'
                : 'Producción (envíos automáticos)'}
            </Text>
            <Text style={styles.infoText} style={{ marginTop: 8 }}>
              Para configurar envíos automáticos, editá notificationService.ts con tus credenciales de Twilio y SendGrid
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal Configuración */}
      <Modal
        visible={showConfigModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowConfigModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configuración de APIs</Text>

            <View style={styles.configSection}>
              <Text style={styles.configTitle}>📱 WhatsApp (Twilio)</Text>
              <Text style={styles.configText}>
                1. Crea una cuenta en twilio.com{'\n'}
                2. Obtén tu Account SID y Auth Token{'\n'}
                3. Configura un número de WhatsApp{'\n'}
                4. Edita notificationService.ts con tus credenciales
              </Text>
            </View>

            <View style={styles.configSection}>
              <Text style={styles.configTitle}>📧 Email (SendGrid)</Text>
              <Text style={styles.configText}>
                1. Crea una cuenta en sendgrid.com{'\n'}
                2. Genera una API Key{'\n'}
                3. Verifica tu dominio de envío{'\n'}
                4. Edita notificationService.ts con tu API Key
              </Text>
            </View>

            <View style={styles.configSection}>
              <Text style={styles.configTitle}>📷 Instagram</Text>
              <Text style={styles.configText}>
                Instagram no permite envíos automáticos por API pública. Los mensajes solo pueden abrirse manualmente en la app.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowConfigModal(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  configButton: {
    fontSize: 24,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  apiCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  apiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  apiIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  apiInfo: {
    flex: 1,
  },
  apiName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  apiStatus: {
    fontSize: 13,
  },
  apiStatusActive: {
    color: '#10b981',
    fontWeight: '600',
  },
  apiStatusInactive: {
    color: '#f59e0b',
    fontWeight: '600',
  },
  apiStatusWarning: {
    color: '#ef4444',
    fontWeight: '600',
  },
  apiDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  testCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  testCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  testButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  infoContent: {
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    color: '#0369a1',
    lineHeight: 18,
  },
  infoTextBold: {
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
    textAlign: 'center',
  },
  configSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  configTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  configText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});