import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Switch,
  Linking,
} from 'react';
import { mockAuth } from '../lib/mockAuth';
import { 
  mockStudioData, 
  mockPriceCategories, 
  mockMessageTemplates,
  StudioData,
  MessageTemplate,
  formatMessageTemplate 
} from '../lib/mockData';
import SafeScreen from '../components/SafeScreen';

type ModalType = 'none' | 'studio' | 'prices' | 'messages';

export default function ProfileScreen() {
  const user = mockAuth.getUser();
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [studioData, setStudioData] = useState<StudioData>(mockStudioData);
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>(mockMessageTemplates);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);

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

  const handleSaveStudioData = () => {
    Alert.alert('✅ Datos guardados', 'La información del estudio se actualizó correctamente');
    setActiveModal('none');
  };

  const handleOpenMaps = () => {
    if (studioData.googleMapsLink) {
      Linking.openURL(studioData.googleMapsLink);
    }
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;
    
    setMessageTemplates(templates => 
      templates.map(t => t.id === editingTemplate.id ? editingTemplate : t)
    );
    setEditingTemplate(null);
    Alert.alert('✅ Plantilla guardada', 'El mensaje se actualizó correctamente');
  };

  const handleTestMessage = (template: MessageTemplate) => {
    const sampleData = {
      nombre: 'Juan Pérez',
      fecha: '15 de octubre',
      hora: '14:00',
      precio: 25000,
      estudio: studioData.name,
      direccion: studioData.address,
    };

    const message = formatMessageTemplate(template.message, sampleData);
    
    Alert.alert(
      '📱 Vista previa del mensaje',
      message,
      [
        { text: 'Cerrar', style: 'cancel' },
        {
          text: 'Enviar por WhatsApp',
          onPress: () => {
            const phone = '+5491112345678'; // Ejemplo
            const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
            Linking.openURL(url).catch(() => {
              Alert.alert('Error', 'No se pudo abrir WhatsApp');
            });
          },
        },
      ]
    );
  };

  const toggleChannel = (channel: 'whatsapp' | 'email' | 'instagram') => {
    if (!editingTemplate) return;
    
    const channels = editingTemplate.channels.includes(channel)
      ? editingTemplate.channels.filter(c => c !== channel)
      : [...editingTemplate.channels, channel];
    
    setEditingTemplate({ ...editingTemplate, channels });
  };

  const MenuItem = ({ icon, title, subtitle, onPress, danger, badge }: any) => (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={onPress}
    >
      <View style={styles.menuIcon}>
        <Text style={styles.menuIconText}>{icon}</Text>
      </View>
      <View style={styles.menuContent}>
        <View style={styles.menuTitleRow}>
          <Text style={[styles.menuTitle, danger && styles.menuTitleDanger]}>
            {title}
          </Text>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  const daysLeft = user?.trialEndsAt 
    ? Math.ceil((user.trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <SafeScreen edges={['top', 'left', 'right']} backgroundColor="#f9fafb">
      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
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
            subtitle={`${studioData.name} • ${studioData.address}`}
            onPress={() => setActiveModal('studio')}
          />
          <MenuItem
            icon="💵"
            title="Lista de precios"
            subtitle="Gestionar precios y categorías"
            badge={mockPriceCategories.reduce((sum, cat) => sum + cat.items.length, 0)}
            onPress={() => setActiveModal('prices')}
          />
          <MenuItem
            icon="💬"
            title="Mensajes automáticos"
            subtitle="Plantillas de WhatsApp, Email e Instagram"
            badge={messageTemplates.filter(t => t.enabled).length}
            onPress={() => setActiveModal('messages')}
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

      {/* Modal Datos del Estudio */}
      <Modal
        visible={activeModal === 'studio'}
        animationType="slide"
        onRequestClose={() => setActiveModal('none')}
      >
        <SafeScreen>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveModal('none')}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Datos del Estudio</Text>
            <TouchableOpacity onPress={handleSaveStudioData}>
              <Text style={styles.modalSave}>Guardar</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            <View style={styles.modalContent}>
              <Text style={styles.inputLabel}>Nombre del estudio *</Text>
              <TextInput
                style={styles.input}
                value={studioData.name}
                onChangeText={(text) => setStudioData({ ...studioData, name: text })}
              />

              <Text style={styles.inputLabel}>Dirección *</Text>
              <TextInput
                style={styles.input}
                value={studioData.address}
                onChangeText={(text) => setStudioData({ ...studioData, address: text })}
              />

              <Text style={styles.inputLabel}>Link de Google Maps</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={studioData.googleMapsLink}
                  onChangeText={(text) => setStudioData({ ...studioData, googleMapsLink: text })}
                  placeholder="https://maps.google.com/?q=..."
                />
                <TouchableOpacity style={styles.testButton} onPress={handleOpenMaps}>
                  <Text style={styles.testButtonText}>Abrir</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Teléfono *</Text>
              <TextInput
                style={styles.input}
                value={studioData.phone}
                onChangeText={(text) => setStudioData({ ...studioData, phone: text })}
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={studioData.email}
                onChangeText={(text) => setStudioData({ ...studioData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Instagram</Text>
              <TextInput
                style={styles.input}
                value={studioData.instagram}
                onChangeText={(text) => setStudioData({ ...studioData, instagram: text })}
                placeholder="@tu_usuario"
              />

              <Text style={styles.inputLabel}>Horarios de atención</Text>
              <TextInput
                style={styles.input}
                value={studioData.workingHours}
                onChangeText={(text) => setStudioData({ ...studioData, workingHours: text })}
                placeholder="Lun-Vie: 10:00-20:00"
              />

              <Text style={styles.inputLabel}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={studioData.description}
                onChangeText={(text) => setStudioData({ ...studioData, description: text })}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholder="Breve descripción de tu estudio..."
              />
            </View>
          </ScrollView>
        </SafeScreen>
      </Modal>

      {/* Modal Lista de Precios */}
      <Modal
        visible={activeModal === 'prices'}
        animationType="slide"
        onRequestClose={() => setActiveModal('none')}
      >
        <SafeScreen>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveModal('none')}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Lista de Precios</Text>
            <View style={{ width: 60 }} />
          </View>
          <ScrollView style={styles.modalScroll}>
            <View style={styles.modalContent}>
              {mockPriceCategories.map(category => (
                <View key={category.id} style={styles.priceCategory}>
                  <Text style={styles.priceCategoryTitle}>{category.name}</Text>
                  {category.items.map(item => (
                    <View key={item.id} style={styles.priceItem}>
                      <View style={styles.priceItemInfo}>
                        <Text style={styles.priceItemName}>{item.name}</Text>
                        {item.description && (
                          <Text style={styles.priceItemDesc}>{item.description}</Text>
                        )}
                      </View>
                      <Text style={styles.priceItemValue}>
                        {item.basePrice > 0 && `$${item.basePrice.toLocaleString()}`}
                        {item.modifier > 0 && `+${item.modifier * 100}%`}
                        {item.basePrice === 0 && item.modifier === 0 && 'Incluido'}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
              
              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>💡</Text>
                <Text style={styles.infoText}>
                  Próximamente podrás editar estos precios. Por ahora, esta es tu lista de precios estándar.
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeScreen>
      </Modal>

      {/* Modal Mensajes Automáticos */}
      <Modal
        visible={activeModal === 'messages'}
        animationType="slide"
        onRequestClose={() => setActiveModal('none')}
      >
        <SafeScreen>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setActiveModal('none')}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Mensajes Automáticos</Text>
            <View style={{ width: 60 }} />
          </View>
          <ScrollView style={styles.modalScroll}>
            <View style={styles.modalContent}>
              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>💬</Text>
                <Text style={styles.infoText}>
                  Los mensajes se envían automáticamente según la configuración. Podés usar variables: {'{nombre}'}, {'{fecha}'}, {'{hora}'}, {'{precio}'}, {'{estudio}'}
                </Text>
              </View>

              {messageTemplates.map(template => (
                <View key={template.id} style={styles.templateCard}>
                  <View style={styles.templateHeader}>
                    <View style={styles.templateInfo}>
                      <Text style={styles.templateName}>{template.name}</Text>
                      <View style={styles.templateChannels}>
                        {template.channels.includes('whatsapp') && (
                          <Text style={styles.channelBadge}>📱 WhatsApp</Text>
                        )}
                        {template.channels.includes('email') && (
                          <Text style={styles.channelBadge}>📧 Email</Text>
                        )}
                        {template.channels.includes('instagram') && (
                          <Text style={styles.channelBadge}>📷 Instagram</Text>
                        )}
                      </View>
                    </View>
                    <Switch
                      value={template.enabled}
                      onValueChange={(value) => {
                        setMessageTemplates(templates =>
                          templates.map(t =>
                            t.id === template.id ? { ...t, enabled: value } : t
                          )
                        );
                      }}
                    />
                  </View>
                  
                  <Text style={styles.templateMessage}>{template.message}</Text>
                  
                  <View style={styles.templateActions}>
                    <TouchableOpacity
                      style={styles.templateButton}
                      onPress={() => setEditingTemplate(template)}
                    >
                      <Text style={styles.templateButtonText}>✏️ Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.templateButton}
                      onPress={() => handleTestMessage(template)}
                    >
                      <Text style={styles.templateButtonText}>👁️ Vista previa</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </SafeScreen>
      </Modal>

      {/* Modal Editar Plantilla */}
      <Modal
        visible={editingTemplate !== null}
        animationType="slide"
        onRequestClose={() => setEditingTemplate(null)}
      >
        <SafeScreen>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditingTemplate(null)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Editar Mensaje</Text>
            <TouchableOpacity onPress={handleSaveTemplate}>
              <Text style={styles.modalSave}>Guardar</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            <View style={styles.modalContent}>
              {editingTemplate && (
                <>
                  <Text style={styles.inputLabel}>Mensaje</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={editingTemplate.message}
                    onChangeText={(text) =>
                      setEditingTemplate({ ...editingTemplate, message: text })
                    }
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />

                  <Text style={styles.inputLabel}>Variables disponibles:</Text>
                  <View style={styles.variablesContainer}>
                    {['{nombre}', '{fecha}', '{hora}', '{precio}', '{estudio}', '{direccion}'].map(variable => (
                      <TouchableOpacity
                        key={variable}
                        style={styles.variableChip}
                        onPress={() => {
                          setEditingTemplate({
                            ...editingTemplate,
                            message: editingTemplate.message + ' ' + variable,
                          });
                        }}
                      >
                        <Text style={styles.variableChipText}>{variable}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.inputLabel}>Canales de envío</Text>
                  <View style={styles.channelSelector}>
                    <TouchableOpacity
                      style={[
                        styles.channelOption,
                        editingTemplate.channels.includes('whatsapp') && styles.channelOptionActive,
                      ]}
                      onPress={() => toggleChannel('whatsapp')}
                    >
                      <Text style={styles.channelOptionIcon}>📱</Text>
                      <Text style={[
                        styles.channelOptionText,
                        editingTemplate.channels.includes('whatsapp') && styles.channelOptionTextActive,
                      ]}>
                        WhatsApp
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.channelOption,
                        editingTemplate.channels.includes('email') && styles.channelOptionActive,
                      ]}
                      onPress={() => toggleChannel('email')}
                    >
                      <Text style={styles.channelOptionIcon}>📧</Text>
                      <Text style={[
                        styles.channelOptionText,
                        editingTemplate.channels.includes('email') && styles.channelOptionTextActive,
                      ]}>
                        Email
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.channelOption,
                        editingTemplate.channels.includes('instagram') && styles.channelOptionActive,
                      ]}
                      onPress={() => toggleChannel('instagram')}
                    >
                      <Text style={styles.channelOptionIcon}>📷</Text>
                      <Text style={[
                        styles.channelOptionText,
                        editingTemplate.channels.includes('instagram') && styles.channelOptionTextActive,
                      ]}>
                        Instagram
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.testMessageButton}
                    onPress={() => handleTestMessage(editingTemplate)}
                  >
                    <Text style={styles.testMessageButtonText}>
                      👁️ Ver cómo se verá el mensaje
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </SafeScreen>
      </Modal>
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
  menuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  menuTitleDanger: {
    color: '#ef4444',
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  badge: {
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
    width: 60,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    width: 60,
    textAlign: 'right',
  },
  modalScroll: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  modalContent: {
    padding: 20,
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
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  inputWithButton: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  testButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  priceCategory: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  priceCategoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  priceItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  priceItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  priceItemDesc: {
    fontSize: 12,
    color: '#666',
  },
  priceItemValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#059669',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
    marginTop: 8,
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
  templateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  templateInfo: {
    flex: 1,
    marginRight: 12,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  templateChannels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  channelBadge: {
    fontSize: 11,
    color: '#666',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  templateMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  templateButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  templateButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  variablesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  variableChip: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  variableChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4338ca',
  },
  channelSelector: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  channelOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f3f4f6',
  },
  channelOptionActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  channelOptionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  channelOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  channelOptionTextActive: {
    color: '#fff',
  },
  testMessageButton: {
    backgroundColor: '#059669',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  testMessageButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});