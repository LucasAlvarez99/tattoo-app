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

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completá todos los campos');
      return;
    }

    setLoading(true);
    const { error } = await localAuth.login(email.trim(), password);
    setLoading(false);

    if (error) {
      Alert.alert('Error de inicio de sesión', error);
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
        >
          <Text style={styles.title}>Tattoo Manager</Text>
          <Text style={styles.subtitle}>Iniciá sesión para continuar</Text>

          <TextInput
            placeholder="Usuario o Email"
            placeholderTextColor="#999"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
            disabled={loading}
          >
            <Text style={styles.registerText}>
              ¿No tenés cuenta? <Text style={styles.registerBold}>Crear cuenta</Text>
            </Text>
          </TouchableOpacity>

          {/* Solo para desarrollo */}
          {__DEV__ && (
            <View style={styles.devInfo}>
              <Text style={styles.devInfoText}>🔧 Modo desarrollo</Text>
              <TouchableOpacity
                style={styles.devButton}
                onPress={() => {
                  setEmail('admin');
                  setPassword('admin');
                }}
              >
                <Text style={styles.devButtonText}>⚡ admin/admin</Text>
              </TouchableOpacity>
            </View>
          )}
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
    justifyContent: 'center',
    padding: 24,
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
    marginBottom: 40,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
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
  registerButton: {
    padding: 12,
  },
  registerText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  registerBold: {
    color: '#000',
    fontWeight: '600',
  },
  devInfo: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  devInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: 8,
    textAlign: 'center',
  },
  devButton: {
    backgroundColor: '#0ea5e9',
    padding: 10,
    borderRadius: 6,
  },
  devButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
});