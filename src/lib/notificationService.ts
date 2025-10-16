import { Linking, Alert } from 'react-native';
import { Appointment, Client, MessageTemplate, mockStudioData } from './mockData';

// ==================== TIPOS ====================

export type NotificationChannel = 'whatsapp' | 'email' | 'instagram';

export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'scheduled';

export type ScheduledNotification = {
  id: string;
  appointmentId: string;
  clientId: string;
  templateId: string;
  channels: NotificationChannel[];
  scheduledFor: Date;
  status: NotificationStatus;
  message: string;
  createdAt: Date;
  sentAt?: Date;
  error?: string;
};

// ==================== CONFIGURACIÓN ====================

// IMPORTANTE: Estas son las credenciales que deberás configurar en producción
export const NOTIFICATION_CONFIG = {
  whatsapp: {
    enabled: false, // Cambiar a true cuando configures Twilio
    apiUrl: 'https://api.twilio.com/2010-04-01/Accounts',
    // accountSid: 'TU_TWILIO_ACCOUNT_SID',
    // authToken: 'TU_TWILIO_AUTH_TOKEN',
    // fromNumber: 'whatsapp:+14155238886', // Número de Twilio
  },
  email: {
    enabled: false, // Cambiar a true cuando configures SendGrid/Mailgun
    apiUrl: 'https://api.sendgrid.com/v3/mail/send',
    // apiKey: 'TU_SENDGRID_API_KEY',
    // fromEmail: 'noreply@tuestudio.com',
    // fromName: mockStudioData.name,
  },
  instagram: {
    enabled: false, // Instagram no permite envíos automáticos oficialmente
    // Por ahora solo abre la app
  },
};

// ==================== STORAGE DE NOTIFICACIONES ====================

let scheduledNotifications: ScheduledNotification[] = [];

export const getScheduledNotifications = () => scheduledNotifications;

export const addScheduledNotification = (notification: ScheduledNotification) => {
  scheduledNotifications.push(notification);
};

export const updateNotificationStatus = (
  id: string, 
  status: NotificationStatus, 
  error?: string
) => {
  scheduledNotifications = scheduledNotifications.map(n =>
    n.id === id 
      ? { ...n, status, sentAt: status === 'sent' ? new Date() : n.sentAt, error }
      : n
  );
};

export const deleteScheduledNotification = (id: string) => {
  scheduledNotifications = scheduledNotifications.filter(n => n.id !== id);
};

// ==================== FORMATEO DE MENSAJES ====================

export const formatNotificationMessage = (
  template: string,
  appointment: Appointment,
  client: Client
): string => {
  const date = new Date(appointment.date);
  
  const replacements: Record<string, string> = {
    '{nombre}': client.fullName,
    '{fecha}': date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    '{hora}': date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    '{precio}': appointment.price ? `$${appointment.price.toLocaleString()}` : 'A confirmar',
    '{estudio}': mockStudioData.name,
    '{direccion}': mockStudioData.address,
    '{telefono}': mockStudioData.phone,
    '{email}': mockStudioData.email,
    '{instagram}': mockStudioData.instagram,
  };

  let message = template;
  Object.entries(replacements).forEach(([key, value]) => {
    message = message.replace(new RegExp(key, 'g'), value);
  });

  return message;
};

// ==================== ENVÍO POR WHATSAPP ====================

export const sendWhatsAppMessage = async (
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Limpiar el número de teléfono
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    if (NOTIFICATION_CONFIG.whatsapp.enabled) {
      // ======== PRODUCCIÓN: Usando Twilio API ========
      // Descomenta esto cuando configures Twilio
      /*
      const response = await fetch(
        `${NOTIFICATION_CONFIG.whatsapp.apiUrl}/${NOTIFICATION_CONFIG.whatsapp.accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(
              `${NOTIFICATION_CONFIG.whatsapp.accountSid}:${NOTIFICATION_CONFIG.whatsapp.authToken}`
            ),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: NOTIFICATION_CONFIG.whatsapp.fromNumber,
            To: `whatsapp:${cleanPhone}`,
            Body: message,
          }).toString(),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error enviando WhatsApp');
      }

      return { success: true };
      */
      
      // Por ahora retorna error porque no está configurado
      return { 
        success: false, 
        error: 'WhatsApp API no configurada. Configura Twilio en notificationService.ts' 
      };
    } else {
      // ======== DESARROLLO: Abre WhatsApp directamente ========
      const url = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
        return { success: true };
      } else {
        throw new Error('No se pudo abrir WhatsApp');
      }
    }
  } catch (error: any) {
    console.error('Error enviando WhatsApp:', error);
    return { success: false, error: error.message };
  }
};

// ==================== ENVÍO POR EMAIL ====================

export const sendEmailMessage = async (
  toEmail: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (NOTIFICATION_CONFIG.email.enabled) {
      // ======== PRODUCCIÓN: Usando SendGrid API ========
      // Descomenta esto cuando configures SendGrid
      /*
      const response = await fetch(NOTIFICATION_CONFIG.email.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTIFICATION_CONFIG.email.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: toEmail }],
              subject: subject,
            },
          ],
          from: {
            email: NOTIFICATION_CONFIG.email.fromEmail,
            name: NOTIFICATION_CONFIG.email.fromName,
          },
          content: [
            {
              type: 'text/plain',
              value: message,
            },
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors?.[0]?.message || 'Error enviando email');
      }

      return { success: true };
      */
      
      // Por ahora retorna error porque no está configurado
      return { 
        success: false, 
        error: 'Email API no configurada. Configura SendGrid en notificationService.ts' 
      };
    } else {
      // ======== DESARROLLO: Abre cliente de email ========
      const url = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
        return { success: true };
      } else {
        throw new Error('No se pudo abrir el cliente de email');
      }
    }
  } catch (error: any) {
    console.error('Error enviando email:', error);
    return { success: false, error: error.message };
  }
};

// ==================== ENVÍO POR INSTAGRAM ====================

export const sendInstagramMessage = async (
  username: string,
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Instagram no permite envío automático de mensajes por API pública
    // Solo podemos abrir la app con el usuario
    
    const cleanUsername = username.replace('@', '');
    
    // Intenta abrir Instagram Direct
    const directUrl = `instagram://direct?to=${cleanUsername}`;
    const canOpenDirect = await Linking.canOpenURL(directUrl);
    
    if (canOpenDirect) {
      await Linking.openURL(directUrl);
      Alert.alert(
        'Instagram abierto',
        'Por favor, enviá manualmente el mensaje. Instagram no permite envíos automáticos.',
        [
          {
            text: 'Copiar mensaje',
            onPress: () => {
              // Aquí podrías usar @react-native-clipboard/clipboard para copiar
              Alert.alert('Mensaje', message);
            },
          },
          { text: 'OK' },
        ]
      );
      return { success: true };
    } else {
      // Fallback: Abre perfil web
      const webUrl = `https://instagram.com/${cleanUsername}`;
      await Linking.openURL(webUrl);
      return { success: true };
    }
  } catch (error: any) {
    console.error('Error abriendo Instagram:', error);
    return { success: false, error: error.message };
  }
};

// ==================== ENVÍO MÚLTIPLE ====================

export const sendNotification = async (
  channels: NotificationChannel[],
  message: string,
  client: Client,
  subject?: string
): Promise<{ success: boolean; results: Record<NotificationChannel, boolean>; errors: string[] }> => {
  const results: Record<NotificationChannel, boolean> = {
    whatsapp: false,
    email: false,
    instagram: false,
  };
  const errors: string[] = [];

  for (const channel of channels) {
    try {
      let result: { success: boolean; error?: string };

      switch (channel) {
        case 'whatsapp':
          result = await sendWhatsAppMessage(client.phone, message);
          results.whatsapp = result.success;
          if (!result.success && result.error) {
            errors.push(`WhatsApp: ${result.error}`);
          }
          break;

        case 'email':
          if (client.email) {
            result = await sendEmailMessage(
              client.email,
              subject || `Recordatorio - ${mockStudioData.name}`,
              message
            );
            results.email = result.success;
            if (!result.success && result.error) {
              errors.push(`Email: ${result.error}`);
            }
          } else {
            errors.push('Email: Cliente no tiene email registrado');
          }
          break;

        case 'instagram':
          if (client.instagram) {
            result = await sendInstagramMessage(client.instagram, message);
            results.instagram = result.success;
            if (!result.success && result.error) {
              errors.push(`Instagram: ${result.error}`);
            }
          } else {
            errors.push('Instagram: Cliente no tiene usuario registrado');
          }
          break;
      }
    } catch (error: any) {
      errors.push(`${channel}: ${error.message}`);
    }
  }

  const success = Object.values(results).some(r => r);

  return { success, results, errors };
};

// ==================== PROGRAMACIÓN DE ENVÍOS ====================

export const scheduleNotification = (
  appointment: Appointment,
  client: Client,
  template: MessageTemplate,
  hoursBeforeOrAfter: number
): ScheduledNotification => {
  const appointmentDate = new Date(appointment.date);
  const scheduledDate = new Date(appointmentDate);
  scheduledDate.setHours(scheduledDate.getHours() + hoursBeforeOrAfter);

  const message = formatNotificationMessage(template.message, appointment, client);

  const notification: ScheduledNotification = {
    id: `notif-${Date.now()}`,
    appointmentId: appointment.id,
    clientId: client.id,
    templateId: template.id,
    channels: template.channels,
    scheduledFor: scheduledDate,
    status: 'scheduled',
    message,
    createdAt: new Date(),
  };

  addScheduledNotification(notification);
  return notification;
};

// ==================== PROCESAMIENTO DE NOTIFICACIONES PENDIENTES ====================

export const processScheduledNotifications = async () => {
  const now = new Date();
  const pending = scheduledNotifications.filter(
    n => n.status === 'scheduled' && n.scheduledFor <= now
  );

  for (const notification of pending) {
    try {
      // Obtener datos del cliente (en producción, desde tu base de datos)
      const client = { 
        phone: '+5491112345678', 
        email: 'cliente@email.com',
        instagram: '@cliente',
        fullName: 'Cliente'
      } as Client;

      const result = await sendNotification(
        notification.channels,
        notification.message,
        client
      );

      if (result.success) {
        updateNotificationStatus(notification.id, 'sent');
      } else {
        updateNotificationStatus(
          notification.id, 
          'failed', 
          result.errors.join(', ')
        );
      }
    } catch (error: any) {
      updateNotificationStatus(notification.id, 'failed', error.message);
    }
  }
};

// ==================== CONFIGURACIÓN DE SCHEDULER ====================

let schedulerInterval: NodeJS.Timeout | null = null;

export const startNotificationScheduler = () => {
  if (schedulerInterval) {
    return; // Ya está corriendo
  }

  // Revisar cada minuto si hay notificaciones pendientes
  schedulerInterval = setInterval(() => {
    processScheduledNotifications();
  }, 60000); // 60 segundos

  console.log('📨 Scheduler de notificaciones iniciado');
};

export const stopNotificationScheduler = () => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('📨 Scheduler de notificaciones detenido');
  }
};

// ==================== TESTING ====================

export const testNotification = async (
  channel: NotificationChannel,
  message: string,
  testData: { phone?: string; email?: string; instagram?: string }
): Promise<{ success: boolean; error?: string }> => {
  try {
    switch (channel) {
      case 'whatsapp':
        if (!testData.phone) {
          return { success: false, error: 'Número de teléfono requerido' };
        }
        return await sendWhatsAppMessage(testData.phone, message);

      case 'email':
        if (!testData.email) {
          return { success: false, error: 'Email requerido' };
        }
        return await sendEmailMessage(
          testData.email,
          'Mensaje de prueba',
          message
        );

      case 'instagram':
        if (!testData.instagram) {
          return { success: false, error: 'Usuario de Instagram requerido' };
        }
        return await sendInstagramMessage(testData.instagram, message);

      default:
        return { success: false, error: 'Canal no soportado' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};