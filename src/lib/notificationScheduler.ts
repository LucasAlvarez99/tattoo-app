// src/lib/notificationScheduler.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment } from './mockData';
import { getAllAppointments } from './appointmentService';

const NOTIFICATION_IDS_KEY = '@tattoo_app:notification_ids';

// ==================== CONFIGURACIÓN ====================

// Configurar cómo se muestran las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ==================== PERMISOS ====================

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('No se otorgaron permisos para notificaciones');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error solicitando permisos:', error);
    return false;
  }
};

// ==================== GESTIÓN DE IDS ====================

interface NotificationMapping {
  appointmentId: string;
  notificationId: string;
  scheduledFor: string;
}

const saveNotificationId = async (mapping: NotificationMapping): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(NOTIFICATION_IDS_KEY);
    const mappings: NotificationMapping[] = data ? JSON.parse(data) : [];
    mappings.push(mapping);
    await AsyncStorage.setItem(NOTIFICATION_IDS_KEY, JSON.stringify(mappings));
  } catch (error) {
    console.error('Error guardando ID de notificación:', error);
  }
};

const getNotificationIds = async (): Promise<NotificationMapping[]> => {
  try {
    const data = await AsyncStorage.getItem(NOTIFICATION_IDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error obteniendo IDs de notificaciones:', error);
    return [];
  }
};

const removeNotificationId = async (appointmentId: string): Promise<void> => {
  try {
    const mappings = await getNotificationIds();
    const filtered = mappings.filter(m => m.appointmentId !== appointmentId);
    await AsyncStorage.setItem(NOTIFICATION_IDS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error eliminando ID de notificación:', error);
  }
};

// ==================== PROGRAMAR NOTIFICACIONES ====================

export const scheduleAppointmentNotification = async (
  appointment: Appointment
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Sin permisos para notificaciones');
      return null;
    }

    const appointmentDate = new Date(appointment.date);
    const notificationDate = new Date(appointmentDate);
    
    // Notificación 1 hora antes
    notificationDate.setHours(notificationDate.getHours() - 1);

    // Si la notificación es en el pasado, programar para dentro de 5 segundos (para testing)
    const now = new Date();
    if (notificationDate < now) {
      console.log('Cita muy cercana, programando notificación de prueba...');
      notificationDate.setTime(now.getTime() + 5000);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎨 Recordatorio de Cita',
        body: `Tenés una cita con ${appointment.clientName} a las ${appointmentDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`,
        data: { appointmentId: appointment.id },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: notificationDate,
    });

    // Guardar el ID para poder cancelarlo después
    await saveNotificationId({
      appointmentId: appointment.id,
      notificationId,
      scheduledFor: notificationDate.toISOString(),
    });

    console.log(`Notificación programada: ${notificationId} para ${notificationDate}`);
    return notificationId;
  } catch (error) {
    console.error('Error programando notificación:', error);
    return null;
  }
};

export const cancelAppointmentNotification = async (appointmentId: string): Promise<void> => {
  try {
    const mappings = await getNotificationIds();
    const mapping = mappings.find(m => m.appointmentId === appointmentId);
    
    if (mapping) {
      await Notifications.cancelScheduledNotificationAsync(mapping.notificationId);
      await removeNotificationId(appointmentId);
      console.log(`Notificación cancelada: ${mapping.notificationId}`);
    }
  } catch (error) {
    console.error('Error cancelando notificación:', error);
  }
};

// ==================== ACTUALIZAR TODAS LAS NOTIFICACIONES ====================

export const refreshAllNotifications = async (): Promise<void> => {
  try {
    // Cancelar todas las notificaciones programadas
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(NOTIFICATION_IDS_KEY);
    
    // Obtener todas las citas futuras
    const appointments = await getAllAppointments();
    const now = new Date();
    
    const futureAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate > now && apt.status !== 'cancelled';
    });

    // Programar notificaciones para todas
    for (const appointment of futureAppointments) {
      await scheduleAppointmentNotification(appointment);
    }
    
    console.log(`${futureAppointments.length} notificaciones reprogramadas`);
  } catch (error) {
    console.error('Error refrescando notificaciones:', error);
  }
};

// ==================== NOTIFICACIÓN DE HOY ====================

export const scheduleTodayNotification = async (): Promise<void> => {
  try {
    const appointments = await getAllAppointments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= today && aptDate < tomorrow && apt.status !== 'cancelled';
    });

    if (todayAppointments.length > 0) {
      // Notificación a las 9 AM recordando las citas del día
      const morningNotification = new Date();
      morningNotification.setHours(9, 0, 0, 0);

      if (morningNotification > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '☀️ Buenos días!',
            body: `Hoy tenés ${todayAppointments.length} ${todayAppointments.length === 1 ? 'cita programada' : 'citas programadas'}`,
            data: { type: 'daily_reminder' },
            sound: true,
          },
          trigger: morningNotification,
        });
      }
    }
  } catch (error) {
    console.error('Error programando notificación diaria:', error);
  }
};

// ==================== LISTENERS ====================

export const setupNotificationListeners = () => {
  // Listener cuando se recibe una notificación mientras la app está abierta
  Notifications.addNotificationReceivedListener(notification => {
    console.log('Notificación recibida:', notification);
  });

  // Listener cuando el usuario toca una notificación
  Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Usuario tocó notificación:', response);
    const appointmentId = response.notification.request.content.data.appointmentId;
    // Aquí podrías navegar a la pantalla de detalle de la cita
  });
};