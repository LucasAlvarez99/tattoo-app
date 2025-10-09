import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { mockAuth } from '../lib/mockAuth';
import SafeScreen from '../components/SafeScreen';

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
      style={profileStyles.menuItem}
      onPress={onPress}
    >
      <View style={profileStyles.menuIcon}>
        <Text style={profileStyles.menuIconText}>{icon}</Text>
      </View>
      <View style={profileStyles.menuContent}>
        <Text style={[profileStyles.menuTitle, danger && profileStyles.menuTitleDanger]}>
          {title}
        </Text>
        {subtitle && <Text style={profileStyles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={profileStyles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  const daysLeft = user?.trialEndsAt 
    ? Math.ceil((user.trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <SafeScreen edges={['top', 'left', 'right']} backgroundColor="#f9fafb">
      <ScrollView 
        style={profileStyles.scroll}
        contentContainerStyle={profileStyles.scrollContent}
      >
        <View style={profileStyles.profileHeader}>
          <View style={profileStyles.avatar}>
            <Text style={profileStyles.avatarText}>
              {user?.fullName?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={profileStyles.name}>{user?.fullName}</Text>
          <Text style={profileStyles.email}>{user?.email}</Text>
          <Text style={profileStyles.studio}>{user?.studioName}</Text>
        </View>

        <View style={profileStyles.subscriptionCard}>
          <View style={profileStyles.subscriptionHeader}>
            <Text style={profileStyles.subscriptionTitle}>
              {user?.subscriptionStatus === 'trial' ? '🎉 Prueba gratis' : '✅ Suscripción activa'}
            </Text>
            {user?.subscriptionStatus === 'trial' && (
              <View style={profileStyles.trialBadge}>
                <Text style={profileStyles.trialBadgeText}>{daysLeft} días</Text>
              </View>
            )}
          </View>
          {user?.subscriptionStatus === 'trial' && (
            <Text style={profileStyles.subscriptionText}>
              Tu período de prueba vence el{' '}
              {user.trialEndsAt.toLocaleDateString('es-AR')}
            </Text>
          )}
          <TouchableOpacity style={profileStyles.upgradeButton}>
            <Text style={profileStyles.upgradeButtonText}>
              {user?.subscriptionStatus === 'trial' 
                ? '⭐ Suscribirme ahora' 
                : 'Gestionar suscripción'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={profileStyles.section}>
          <Text style={profileStyles.sectionTitle}>Estudio</Text>
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

        <View style={profileStyles.section}>
          <Text style={profileStyles.sectionTitle}>Cuenta</Text>
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

        <View style={profileStyles.section}>
          <Text style={profileStyles.sectionTitle}>Soporte</Text>
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

        <View style={profileStyles.section}>
          <MenuItem
            icon="🚪"
            title="Cerrar sesión"
            onPress={handleLogout}
            danger
          />
        </View>

        <Text style={profileStyles.version}>Versión 1.0.0 (Beta)</Text>
      </ScrollView>
    </SafeScreen>
  );
}

const profileStyles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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