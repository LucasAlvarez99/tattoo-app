import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { mockPriceCategories, calculateQuote } from '../lib/mockData';

type Props = NativeStackScreenProps<RootStackParamList, 'QuoteScreen'>;

export default function QuoteScreen({ navigation }: Props) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [customAdjustment, setCustomAdjustment] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const sizeCategory = mockPriceCategories.find(c => c.id === 'size');
  const styleCategory = mockPriceCategories.find(c => c.id === 'style');
  const zoneCategory = mockPriceCategories.find(c => c.id === 'zone');
  const extrasCategory = mockPriceCategories.find(c => c.id === 'extras');

  const handleCalculate = () => {
    if (!selectedSize || !selectedStyle || !selectedZone) {
      Alert.alert('Error', 'Por favor seleccioná tamaño, estilo y zona');
      return;
    }

    let price = calculateQuote(selectedSize, selectedStyle, selectedZone, selectedExtras);
    
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
    setSelectedSize('');
    setSelectedStyle('');
    setSelectedZone('');
    setSelectedExtras([]);
    setCustomAdjustment('');
    setCalculatedPrice(null);
  };

  const toggleExtra = (extraId: string) => {
    if (selectedExtras.includes(extraId)) {
      setSelectedExtras(selectedExtras.filter(id => id !== extraId));
    } else {
      setSelectedExtras([...selectedExtras, extraId]);
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
            navigation.navigate('NewAppointment', {});
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Tamaño */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Tamaño *</Text>
          {sizeCategory?.items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.optionCard,
                selectedSize === item.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedSize(item.id)}
            >
              <View style={styles.optionInfo}>
                <Text style={[
                  styles.optionName,
                  selectedSize === item.id && styles.optionNameSelected,
                ]}>
                  {item.name}
                </Text>
                {item.description && (
                  <Text style={styles.optionDescription}>{item.description}</Text>
                )}
              </View>
              <Text style={styles.optionPrice}>${item.basePrice.toLocaleString()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Estilo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Estilo *</Text>
          {styleCategory?.items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.optionCard,
                selectedStyle === item.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedStyle(item.id)}
            >
              <View style={styles.optionInfo}>
                <Text style={[
                  styles.optionName,
                  selectedStyle === item.id && styles.optionNameSelected,
                ]}>
                  {item.name}
                </Text>
                {item.description && (
                  <Text style={styles.optionDescription}>{item.description}</Text>
                )}
              </View>
              {item.modifier > 0 && (
                <Text style={styles.optionModifier}>+{item.modifier * 100}%</Text>
              )}
              {item.modifier === 0 && (
                <Text style={styles.optionBase}>Base</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Zona */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Zona del Cuerpo *</Text>
          {zoneCategory?.items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.optionCard,
                selectedZone === item.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedZone(item.id)}
            >
              <View style={styles.optionInfo}>
                <Text style={[
                  styles.optionName,
                  selectedZone === item.id && styles.optionNameSelected,
                ]}>
                  {item.name}
                </Text>
                {item.description && (
                  <Text style={styles.optionDescription}>{item.description}</Text>
                )}
              </View>
              {item.basePrice > 0 ? (
                <Text style={styles.optionPrice}>+${item.basePrice.toLocaleString()}</Text>
              ) : (
                <Text style={styles.optionBase}>Incluido</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Extras */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Extras (Opcional)</Text>
          {extrasCategory?.items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.optionCard,
                selectedExtras.includes(item.id) && styles.optionCardSelected,
              ]}
              onPress={() => toggleExtra(item.id)}
            >
              <View style={styles.optionInfo}>
                <Text style={[
                  styles.optionName,
                  selectedExtras.includes(item.id) && styles.optionNameSelected,
                ]}>
                  {item.name}
                </Text>
                {item.description && (
                  <Text style={styles.optionDescription}>{item.description}</Text>
                )}
              </View>
              {item.basePrice > 0 ? (
                <Text style={styles.optionPrice}>+${item.basePrice.toLocaleString()}</Text>
              ) : (
                <Text style={styles.optionFree}>Gratis</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Ajuste manual */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Ajuste Manual (Opcional)</Text>
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

        {/* Botones de acción */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>🔄 Reiniciar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
            <Text style={styles.calculateButtonText}>💰 Calcular</Text>
          </TouchableOpacity>
        </View>

        {/* Resultado */}
        {calculatedPrice !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Precio Total</Text>
            <Text style={styles.resultPrice}>
              ${calculatedPrice.toLocaleString()}
            </Text>

            <View style={styles.resultDivider} />

            <Text style={styles.resultDetailsTitle}>Detalles:</Text>
            {selectedSize && (
              <Text style={styles.resultDetail}>
                • {sizeCategory?.items.find(i => i.id === selectedSize)?.name}
              </Text>
            )}
            {selectedStyle && (
              <Text style={styles.resultDetail}>
                • {styleCategory?.items.find(i => i.id === selectedStyle)?.name}
              </Text>
            )}
            {selectedZone && (
              <Text style={styles.resultDetail}>
                • {zoneCategory?.items.find(i => i.id === selectedZone)?.name}
              </Text>
            )}
            {selectedExtras.length > 0 && selectedExtras.map(extraId => {
              const extra = extrasCategory?.items.find(i => i.id === extraId);
              return extra ? (
                <Text key={extraId} style={styles.resultDetail}>
                  • {extra.name}
                </Text>
              ) : null;
            })}
            {customAdjustment && (
              <Text style={styles.resultDetail}>
                • Ajuste manual: ${parseFloat(customAdjustment).toLocaleString()}
              </Text>
            )}

            <TouchableOpacity
              style={styles.appointmentButton}
              onPress={handleCreateAppointment}
            >
              <Text style={styles.appointmentButtonText}>
                📅 Crear cita con esta cotización
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Esta es una estimación basada en tu lista de precios. Podés ajustarla manualmente antes de crear la cita.
          </Text>
        </View>

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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
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
  optionPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  optionModifier: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
  },
  optionBase: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  optionFree: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
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
});