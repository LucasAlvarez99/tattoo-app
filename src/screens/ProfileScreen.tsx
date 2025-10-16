import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from '../types/navigation';
import { mockAuth } from '../lib/mockAuth';
import { mockStudioData, mockPriceCategories, mockMessageTemplates } from '../lib/mockData';
import SafeScreen from '../components/SafeScreen';
import ProfileHeader from '../components/ProfileHeader';
import SubscriptionCard from '../components/SubscriptionCard';
import ProfileMenuItem from '../components/ProfileMenuItem';
import StudioDataModal from '../components/modals/StudioDataModal';
import MessagesModal from '../components/modals/MessagesModal';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'ProfileTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

type ModalType = 'none' | 'studio' | 'messages';

export default function ProfileScreen({ navigation }: Props) {
  const user = mockAuth.getUser();
  const [activeModal, setActiveModal] = useState<ModalType>('none');

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

  return (
    <SafeScreen edges={['top', 'left', 'right']} backgroundColor="#f9fafb">
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <ProfileHeader user={user} />
        <SubscriptionCard user={user} />

        {/* Sección Estudio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estudio</Text>
          <ProfileMenuItem
            icon="🏢"
            title="Datos del estudio"
            subtitle={`${mockStudioData.name} • ${mockStudioData.address}`}
            onPress={() => setActiveModal('studio')}
          />
          <ProfileMenuItem
            icon="💵"
            title="Lista de precios"
            subtitle="Gestionar precios y categorías"
            badge={mockPriceCategories.reduce((sum, cat) => 
              sum + cat.items.filter(i => i.isActive).length, 0
            )}
            onPress={() => navigation.navigate('PriceManagement')}
          />
          <ProfileMenuItem
            icon="💬"
            title="Mensajes automáticos"
            subtitle="Gestionar envíos automáticos"
            badge={mockMessageTemplates.filter(t => t.enabled).length}
            onPress={() => navigation.navigate('NotificationManagement')}
          />
          <ProfileMenuItem
            icon="📝"
            title="Plantillas de mensajes"
            subtitle="Editar textos de recordatorios"
            onPress={() => setActiveModal('messages')}
          />
          <ProfileMenuItem
            icon="📄"
            title="Exportar agenda a PDF"
            subtitle="Generar PDF para imprimir o compartir"
            onPress={() => navigation.navigate('ExportPDF')}
          />
        </View>

        {/* Sección Cuenta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          <ProfileMenuItem
            icon="👤"
            title="Datos personales"
            subtitle={user?.phone}
            onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
          />
          <ProfileMenuItem
            icon="🔒"
            title="Seguridad"
            subtitle="Cambiar contraseña"
            onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
          />
          <ProfileMenuItem
            icon="💳"
            title="Pagos y facturación"
            subtitle="Historial de pagos"
            onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
          />
        </View>

        {/* Sección Soporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>
          <ProfileMenuItem
            icon="❓"
            title="Ayuda y preguntas frecuentes"
            onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
          />
          <ProfileMenuItem
            icon="📧"
            title="Contactar soporte"
            onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
          />
          <ProfileMenuItem
            icon="⭐"
            title="Calificar la app"
            onPress={() => Alert.alert('Próximamente', 'Esta función estará disponible pronto')}
          />
        </View>

        {/* Cerrar sesión */}
        <View style={styles.section}>
          <ProfileMenuItem
            icon="🚪"
            title="Cerrar sesión"
            onPress={handleLogout}
            danger
          />
        </View>

        <Text style={styles.version}>Versión 1.0.0 (Beta)</Text>
      </ScrollView>

      {/* Modales */}
      <StudioDataModal
        visible={activeModal === 'studio'}
        onClose={() => setActiveModal('none')}
      />

      <MessagesModal
        visible={activeModal === 'messages'}
        onClose={() => setActiveModal('none')}
      />
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
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    paddingVertical: 24,
  },
});