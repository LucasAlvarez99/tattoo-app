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

type Props = NativeStackScreenProps<RootStackParamList, 'QuoteScreen'>;

export default function QuoteScreen({ navigation }: Props) {
  const [size, setSize] = useState('');
  const [hours, setHours] = useState('');
  const [complexity, setComplexity] = useState<'simple' | 'medium' | 'complex'>('medium');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const calculatePrice = () => {
    if (!size || !hours) {
      Alert.alert('Error', 'Por favor completá tamaño y horas estimadas');
      return;
    }

    const sizeNum = parseFloat(size);
    const hoursNum = parseFloat(hours);

    let basePrice = 10000; // Precio base por hora
    
    // Ajustar por complejidad
    if (complexity === 'simple') basePrice = 8000;
    if (complexity === 'complex') basePrice = 15000;

    // Ajustar por tamaño
    let sizeMultiplier = 1;
    if (sizeNum > 20) sizeMultiplier = 1.5;
    if (sizeNum > 30) sizeMultiplier = 2;

    const total = Math.round(basePrice * hoursNum * sizeMultiplier);
    setCalculatedPrice(total);
  };

  const handleCreateAppointment = () => {
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
          <Text style={styles.label}>Tamaño del tatuaje (cm) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ejemplo: 15"
            placeholderTextColor="#999"
            value={size}
            onChangeText={setSize}
            keyboardType="numeric"
          />
        </View>

        {/* Horas estimadas */}
        <View style={styles.section}>
          <Text style={styles.label}>Horas estimadas *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ejemplo: 2"
            placeholderTextColor="#999"
            value={hours}
            onChangeText={setHours}
            keyboardType="numeric"
          />
        </View>

        {/* Complejidad */}
        <View style={styles.section}>
          <Text style={styles.label}>Complejidad</Text>
          <View style={styles.complexitySelector}>
            <TouchableOpacity
              style={[
                styles.complexityButton,
                complexity === 'simple' && styles.complexityButtonSelected,
              ]}
              onPress={() => setComplexity('simple')}
            >
              <Text
                style={[
                  styles.complexityText,
                  complexity === 'simple' && styles.complexityTextSelected,
                ]}
              >
                Simple
              </Text>
              <Text style={styles.complexityPrice}>$8k/hora</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.complexityButton,
                complexity === 'medium' && styles.complexityButtonSelected,
              ]}
              onPress={() => setComplexity('medium')}
            >
              <Text
                style={[
                  styles.complexityText,
                  complexity === 'medium' && styles.complexityTextSelected,
                ]}
              >
                Media
              </Text>
              <Text style={styles.complexityPrice}>$10k/hora</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.complexityButton,
                complexity === 'complex' && styles.complexityButtonSelected,
              ]}
              onPress={() => setComplexity('complex')}
            >
              <Text
                style={[
                  styles.complexityText,
                  complexity === 'complex' && styles.complexityTextSelected,
                ]}
              >
                Compleja
              </Text>
              <Text style={styles.complexityPrice}>$15k/hora</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón calcular */}
        <TouchableOpacity style={styles.calculateButton} onPress={calculatePrice}>
          <Text style={styles.calculateButtonText}>💰 Calcular precio</Text>
        </TouchableOpacity>

        {/* Resultado */}
        {calculatedPrice !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Precio estimado</Text>
            <Text style={styles.resultPrice}>
              ${calculatedPrice.toLocaleString()}
            </Text>
            <View style={styles.resultDetails}>
              <Text style={styles.resultDetail}>
                • Tamaño: {size}cm
              </Text>
              <Text style={styles.resultDetail}>
                • Duración: {hours}hs
              </Text>
              <Text style={styles.resultDetail}>
                • Complejidad: {complexity === 'simple' ? 'Simple' : complexity === 'medium' ? 'Media' : 'Compleja'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.appointmentButton}
              onPress={handleCreateAppointment}
            >
              <Text style={styles.appointmentButtonText}>
                Crear cita con esta cotización
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Esta es una estimación. Podés ajustar el precio al crear la cita.
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
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  complexitySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  complexityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  complexityButtonSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  complexityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  complexityTextSelected: {
    color: '#fff',
  },
  complexityPrice: {
    fontSize: 11,
    color: '#999',
  },
  calculateButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  calculateButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 12,
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#059669',
    textAlign: 'center',
    marginBottom: 16,
  },
  resultDetails: {
    marginBottom: 16,
  },
  resultDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  appointmentButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  appointmentButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#0369a1',
  },
});