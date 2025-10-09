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
import { mockAuth } from '../lib/mockAuth';
import SafeScreen from '../components/SafeScreen';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completá todos los campos');
      return;
    }

    setLoading(true);
    const { error } = await mockAuth.login(email.trim(), password);
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

          <View style={styles.devInfo}>
            <Text style={styles.devInfoText}>🔧 Modo desarrollo</Text>
            <Text style={styles.devInfoSmall}>Usuario: admin</Text>
            <Text style={styles.devInfoSmall}>Contraseña: admin</Text>
          </View>

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
            style={styles.quickLoginButton}
            onPress={() => {
              setEmail('admin');
              setPassword('admin');
            }}
            disabled={loading}
          >
            <Text style={styles.quickLoginText}>⚡ Autocompletar credenciales</Text>
          </TouchableOpacity>
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
    marginBottom: 30,
    color: '#666',
  },
  devInfo: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
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
  devInfoSmall: {
    fontSize: 12,
    color: '#0369a1',
    textAlign: 'center',
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
  quickLoginButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  quickLoginText: {
    textAlign: 'center',
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
});
