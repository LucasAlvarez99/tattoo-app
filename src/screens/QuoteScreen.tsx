import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { mockPriceCategories, calculateFlexibleQuote } from '../lib/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'QuoteScreen'>;

export default function QuoteScreen({ navigation }: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [customAdjustment, setCustomAdjustment] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  // Solo mostrar categorías activas con items activos
  const activeCategories = mockPriceCategories.filter(
    cat => cat.isActive && cat.items.some(item => item.isActive)
  );

  const handleCalculate = () => {
    if (selectedItems.length === 0) {
      Alert.alert('Seleccioná al menos un precio', 'Elegí uno o más ítems para cotizar');
      return;
    }

    let price = calculateFlexibleQuote(selectedItems);
    
    // Ajuste manual
    if (customAdjustment) {
      const adjustment = parseFloat(customAdjustment);
      if (!isNaN(adjustment)) {
        price += adjustment;
      }
    }

    setCalculatedPrice(price);
  };

  const handleReset = () => {
    setSelectedItems([]);
    setCustomAdjustment('');
    setCalculatedPrice(null);
  };

  const toggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleCreateAppointment = () => {
    if (calculatedPrice === null) {
      Alert.alert('Error', 'Primero calculá el precio');
      return;
    }

    Alert.alert(
      'Crear cita',
      '¿Querés crear una cita con esta cotización?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, crear',
          onPress: () => {
            navigation.goBack();
            setTimeout(() => {
              navigation.navigate('NewAppointment', {});
            }, 100);
          },
        },
      ]
    );
  };

  const getSelectedItemsDetails = () => {
    const details: string[] = [];
    selectedItems.forEach(itemId => {
      mockPriceCategories.forEach(category => {
        const item = category.items.find(i => i.id === itemId);
        if (item) {
          details.push(`${item.name} - $${item.basePrice.toLocaleString()}`);
        }
      });
    });
    return details;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.headerIcon}>💰</Text>
          <Text style={styles.headerTitle}>Cotizador Flexible</Text>
          <Text style={styles.headerSubtitle}>
            Seleccioná uno o más precios de tus categorías personalizadas
          </Text>
        </View>

        {activeCategories.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📋</Text>
            <Text style={styles.emptyStateText}>No hay precios configurados</Text>
            <Text style={styles.emptyStateSubtext}>
              Configurá tus precios en el perfil para poder cotizar
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => {
                navigation.goBack();
                navigation.navigate('MainTabs', {
                  screen: 'ProfileTab',
                });
              }}
            >
              <Text style={styles.emptyButtonText}>Ir a configurar precios</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Categorías y precios */}
        {activeCategories.map((category, catIndex) => (
          <View key={category.id} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {catIndex + 1}. {category.name}
            </Text>
            {category.description && (
              <Text style={styles.sectionDescription}>{category.description}</Text>
            )}

            {category.items
              .filter(item => item.isActive)
              .map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.optionCard,
                    selectedItems.includes(item.id) && styles.optionCardSelected,
                  ]}
                  onPress={() => toggleItem(item.id)}
                >
                  <View style={styles.optionInfo}>
                    <Text
                      style={[
                        styles.optionName,
                        selectedItems.includes(item.id) && styles.optionNameSelected,
                      ]}
                    >
                      {item.name}
                    </Text>
                    {item.description && (
                      <Text style={styles.optionDescription}>{item.description}</Text>
                    )}
                  </View>
                  <View style={styles.optionRight}>
                    <Text style={styles.optionPrice}>
                      ${item.basePrice.toLocaleString()}
                    </Text>
                    {selectedItems.includes(item.id) && (
                      <View style={styles.checkMark}>
                        <Text style={styles.checkMarkText}>✓</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        ))}

        {/* Ajuste manual */}
        {activeCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {activeCategories.length + 1}. Ajuste Manual (Opcional)
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: +5000 o -3000"
              placeholderTextColor="#999"
              value={customAdjustment}
              onChangeText={setCustomAdjustment}
              keyboardType="numeric"
            />
            <Text style={styles.hint}>
              Agregá o restá un monto para ajustar el precio final
            </Text>
          </View>
        )}

        {/* Botones de acción */}
        {activeCategories.length > 0 && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>🔄 Reiniciar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
              <Text style={styles.calculateButtonText}>💰 Calcular</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Resultado */}
        {calculatedPrice !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Precio Total</Text>
            <Text style={styles.resultPrice}>${calculatedPrice.toLocaleString()}</Text>

            <View style={styles.resultDivider} />

            <Text style={styles.resultDetailsTitle}>Detalles de la cotización:</Text>
            {getSelectedItemsDetails().map((detail, index) => (
              <Text key={index} style={styles.resultDetail}>
                • {detail}
              </Text>
            ))}

            {customAdjustment && parseFloat(customAdjustment) !== 0 && (
              <Text style={styles.resultDetail}>
                • Ajuste manual: ${parseFloat(customAdjustment).toLocaleString()}
              </Text>
            )}

            <View style={styles.resultSummary}>
              <Text style={styles.resultSummaryLabel}>Items seleccionados:</Text>
              <Text style={styles.resultSummaryValue}>{selectedItems.length}</Text>
            </View>

            <TouchableOpacity
              style={styles.appointmentButton}
              onPress={handleCreateAppointment}
            >
              <Text style={styles.appointmentButtonText}>
                📅 Crear cita con esta cotización
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => Alert.alert('Compartir', 'Funcionalidad próximamente')}
            >
              <Text style={styles.shareButtonText}>📤 Compartir cotización</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info */}
        {activeCategories.length > 0 && (
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              Seleccioná todos los ítems que apliquen para tu tatuaje. El precio final será la suma de todos.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  optionCardSelected: {
    borderColor: '#000',
    backgroundColor: '#f9fafb',
  },
  optionInfo: {
    flex: 1,
    marginRight: 12,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  optionNameSelected: {
    color: '#000',
  },
  optionDescription: {
    fontSize: 13,
    color: '#666',
  },
  optionRight: {
    alignItems: 'flex-end',
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  checkMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  resetButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  calculateButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#059669',
    alignItems: 'center',
  },
  calculateButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#f0fdf4',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#059669',
    marginBottom: 20,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultPrice: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#059669',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultDivider: {
    height: 1,
    backgroundColor: '#d1fae5',
    marginVertical: 16,
  },
  resultDetailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  resultDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  resultSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#d1fae5',
  },
  resultSummaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  resultSummaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  appointmentButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  appointmentButtonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#f3f4f6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  shareButtonText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
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
  emptyState: {
    padding: 48,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});