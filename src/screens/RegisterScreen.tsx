import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { localAuth } from '../lib/localAuthService';
import SafeScreen from '../components/SafeScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studioName, setStudioName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    // Validaciones
    if (!email || !password || !confirmPassword || !fullName || !studioName || !phone) {
      Alert.alert('Error', 'Por favor completá todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Ingresá un email válido');
      return;
    }

    setLoading(true);
    const { error } = await localAuth.register(
      email.trim(),
      password,
      fullName.trim(),
      studioName.trim(),
      phone.trim()
    );
    setLoading(false);

    if (error) {
      Alert.alert('Error de registro', error);
    } else {
      Alert.alert(
        '🎉 ¡Cuenta creada!',
        'Tu cuenta se creó exitosamente con 30 días de prueba gratis.',
        [{ text: 'Empezar', onPress: () => {} }]
      );
    }
  }

  return (
    <SafeScreen>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Empezá tu prueba gratis de 7 días</Text>

          <Text style={styles.inputLabel}>Nombre completo *</Text>
          <TextInput
            placeholder="Juan Pérez"
            placeholderTextColor="#999"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            editable={!loading}
          />

          <Text style={styles.inputLabel}>Email *</Text>
          <TextInput
            placeholder="tu@email.com"
            placeholderTextColor="#999"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <Text style={styles.inputLabel}>Nombre del estudio *</Text>
          <TextInput
            placeholder="Studio Ink Master"
            placeholderTextColor="#999"
            style={styles.input}
            value={studioName}
            onChangeText={setStudioName}
            editable={!loading}
          />

          <Text style={styles.inputLabel}>Teléfono *</Text>
          <TextInput
            placeholder="+54 9 11 1234-5678"
            placeholderTextColor="#999"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!loading}
          />

          <Text style={styles.inputLabel}>Contraseña *</Text>
          <TextInput
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#999"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />

          <Text style={styles.inputLabel}>Confirmar contraseña *</Text>
          <TextInput
            placeholder="Repetí tu contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
          />

          <View style={styles.benefitsBox}>
            <Text style={styles.benefitsTitle}>✨ Incluye:</Text>
            <Text style={styles.benefitItem}>✓ 30 días de prueba gratis</Text>
            <Text style={styles.benefitItem}>✓ Gestión ilimitada de clientes</Text>
            <Text style={styles.benefitItem}>✓ Agenda y recordatorios</Text>
            <Text style={styles.benefitItem}>✓ Catálogo de diseños</Text>
            <Text style={styles.benefitItem}>✓ Sin tarjeta de crédito requerida</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Crear cuenta gratis</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
            style={styles.loginLink}
          >
            <Text style={styles.linkText}>
              ¿Ya tenés cuenta? <Text style={styles.linkBold}>Iniciá sesión</Text>
            </Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    marginBottom: 8,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  benefitsBox: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  benefitItem: {
    fontSize: 14,
    color: '#059669',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    padding: 12,
  },
  linkText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  linkBold: {
    color: '#000',
    fontWeight: '600',
  },
});