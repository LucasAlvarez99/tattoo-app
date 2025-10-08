import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { mockAuth } from '../lib/mockAuth';

export default function ProfileScreen() {
  const user = mockAuth.getUser();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que querés cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => mockAuth.logout(),
        },
      ]
    );
  };

  const MenuItem = ({ icon, title, subtitle, onPress, danger }: any) => (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={onPress}
    >
      <View style={styles.menuIcon}>
        <Text style={styles.menuIconText}>{icon}</Text>
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, danger && styles.menuTitleDanger]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  const daysLeft = user?.trialEndsAt 
    ? Math.ceil((user.trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{user?.fullName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.studio}>{user?.studioName}</Text>
        </View>

        <View style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <Text style={styles.subscriptionTitle}>
              {user?.subscriptionStatus === 'trial' ? '🎉 Prueba gratis' : '✅ Suscripción activa'}
            </Text>
            {user?.subscriptionStatus === 'trial' && (
              <View style={styles.trialBadge}>
                <Text style={styles.trialBadgeText}>{daysLeft} días</Text>
              </View>
            )}
          </View>
          {user?.subscriptionStatus === 'trial' && (
            <Text style={styles.subscriptionText}>
              Tu período de prueba vence el{' '}
              {user.trialEndsAt.toLocaleDateString('es-AR')}
            </Text>
          )}
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>
              {user?.subscriptionStatus === 'trial' 
                ? '⭐ Suscribirme ahora' 
                : 'Gestionar suscripción'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estudio</Text>
          <MenuItem
            icon="🏢"
            title="Datos del estudio"
            subtitle="Nombre, dirección, horarios"
            onPress={() => {}}
          />
          <MenuItem
            icon="💵"
            title="Lista de precios"
            subtitle="Gestionar precios y promociones"
            onPress={() => {}}
          />
          <MenuItem
            icon="💬"
            title="Mensajes automáticos"
            subtitle="Plantillas de WhatsApp"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          <MenuItem
            icon="👤"
            title="Datos personales"
            subtitle={user?.phone}
            onPress={() => {}}
          />
          <MenuItem
            icon="🔒"
            title="Seguridad"
            subtitle="Cambiar contraseña"
            onPress={() => {}}
          />
          <MenuItem
            icon="💳"
            title="Pagos y facturación"
            subtitle="Historial de pagos"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>
          <MenuItem
            icon="❓"
            title="Ayuda y preguntas frecuentes"
            onPress={() => {}}
          />
          <MenuItem
            icon="📧"
            title="Contactar soporte"
            onPress={() => {}}
          />
          <MenuItem
            icon="⭐"
            title="Calificar la app"
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <MenuItem
            icon="🚪"
            title="Cerrar sesión"
            onPress={handleLogout}
            danger
          />
        </View>

        <Text style={styles.version}>Versión 1.0.0 (Beta)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scroll: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '600',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  studio: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  subscriptionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  trialBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trialBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  subscriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIconText: {
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  menuTitleDanger: {
    color: '#ef4444',
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  menuArrow: {
    fontSize: 24,
    color: '#ccc',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    paddingVertical: 24,
  },
});