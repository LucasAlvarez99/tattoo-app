import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import {
  mockMessageTemplates,
  mockStudioData,
  MessageTemplate,
  formatMessageTemplate,
} from '../../lib/mockData';
import SafeScreen from '../SafeScreen';

interface MessagesModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function MessagesModal({ visible, onClose }: MessagesModalProps) {
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>(mockMessageTemplates);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);

  const handleTestMessage = (template: MessageTemplate) => {
    const sampleData = {
      nombre: 'Juan Pérez',
      fecha: '15 de octubre',
      hora: '14:00',
      precio: 25000,
      estudio: mockStudioData.name,
      direccion: mockStudioData.address,
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
            const phone = '+5491112345678';
            const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
            Linking.openURL(url).catch(() => {
              Alert.alert('Error', 'No se pudo abrir WhatsApp');
            });
          },
        },
      ]
    );
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;
    
    setMessageTemplates(templates => 
      templates.map(t => t.id === editingTemplate.id ? editingTemplate : t)
    );
    setEditingTemplate(null);
    Alert.alert('✅ Plantilla guardada', 'El mensaje se actualizó correctamente');
  };

  const toggleChannel = (channel: 'whatsapp' | 'email' | 'instagram') => {
    if (!editingTemplate) return;
    
    const channels = editingTemplate.channels.includes(channel)
      ? editingTemplate.channels.filter(c => c !== channel)
      : [...editingTemplate.channels, channel];
    
    setEditingTemplate({ ...editingTemplate, channels });
  };

  return (
    <>
      {/* Modal Lista de Plantillas */}
      <Modal
        visible={visible && !editingTemplate}
        animationType="slide"
        onRequestClose={onClose}
      >
        <SafeScreen>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Plantillas de Mensajes</Text>
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
    </>
  );
}

const styles = StyleSheet.create({
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
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
    marginBottom: 16,
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