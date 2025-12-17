import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { localAuth } from '../lib/localAuthService';
import SafeScreen from '../components/SafeScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'ChangePassword'>;

export default function ChangePasswordScreen({ navigation }: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChangePassword = async () => {
    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completá todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'La nueva contraseña y la confirmación no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword === currentPassword) {
      Alert.alert('Error', 'La nueva contraseña debe ser diferente a la actual');
      return;
    }

    setLoading(true);
    const { success, error } = await localAuth.changePassword(currentPassword, newPassword);
    setLoading(false);

    if (success) {
      Alert.alert(
        '✅ Contraseña actualizada',
        'Tu contraseña se cambió correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              navigation.goBack();
            },
          },
        ]
      );
    } else {
      Alert.alert('Error', error || 'No se pudo cambiar la contraseña');
    }
  };

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹ Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cambiar Contraseña</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>🔒</Text>
          <Text style={styles.infoText}>
            Por seguridad, necesitás ingresar tu contraseña actual antes de establecer una nueva
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>Contraseña actual *</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Tu contraseña actual"
              placeholderTextColor="#999"
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              editable={!loading}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <Text style={styles.eyeIcon}>{showCurrentPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.inputLabel}>Nueva contraseña *</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#999"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              editable={!loading}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Text style={styles.eyeIcon}>{showNewPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
          
          {/* Indicador de fortaleza */}
          {newPassword.length > 0 && (
            <View style={styles.strengthIndicator}>
              <View
                style={[
                  styles.strengthBar,
                  newPassword.length < 6 && styles.strengthWeak,
                  newPassword.length >= 6 && newPassword.length < 10 && styles.strengthMedium,
                  newPassword.length >= 10 && styles.strengthStrong,
                ]}
              />
              <Text style={styles.strengthText}>
                {newPassword.length < 6 && '🔴 Débil'}
                {newPassword.length >= 6 && newPassword.length < 10 && '🟡 Media'}
                {newPassword.length >= 10 && '🟢 Fuerte'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.inputLabel}>Confirmar nueva contraseña *</Text>
          <TextInput
            style={styles.input}
            placeholder="Repetí la nueva contraseña"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
            autoCapitalize="none"
          />
          
          {/* Indicador de coincidencia */}
          {confirmPassword.length > 0 && (
            <View style={styles.matchIndicator}>
              {newPassword === confirmPassword ? (
                <Text style={styles.matchText}>✅ Las contraseñas coinciden</Text>
              ) : (
                <Text style={styles.noMatchText}>❌ Las contraseñas no coinciden</Text>
              )}
            </View>
          )}
        </View>

        {/* Requisitos */}
        <View style={styles.requirementsBox}>
          <Text style={styles.requirementsTitle}>Requisitos de la contraseña:</Text>
          <Text style={[
            styles.requirement,
            newPassword.length >= 6 && styles.requirementMet
          ]}>
            {newPassword.length >= 6 ? '✅' : '⭕'} Al menos 6 caracteres
          </Text>
          <Text style={[
            styles.requirement,
            newPassword !== currentPassword && styles.requirementMet
          ]}>
            {newPassword !== currentPassword ? '✅' : '⭕'} Diferente a la actual
          </Text>
          <Text style={[
            styles.requirement,
            newPassword === confirmPassword && newPassword.length > 0 && styles.requirementMet
          ]}>
            {newPassword === confirmPassword && newPassword.length > 0 ? '✅' : '⭕'} Confirmación correcta
          </Text>
        </View>

        {/* Botón */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cambiar contraseña</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
  },
  section: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  eyeButton: {
    padding: 14,
  },
  eyeIcon: {
    fontSize: 20,
  },
  strengthIndicator: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  strengthWeak: {
    width: '33%',
    backgroundColor: '#ef4444',
  },
  strengthMedium: {
    width: '66%',
    backgroundColor: '#f59e0b',
  },
  strengthStrong: {
    width: '100%',
    backgroundColor: '#10b981',
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '500',
  },
  matchIndicator: {
    marginTop: 8,
  },
  matchText: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '500',
  },
  noMatchText: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '500',
  },
  requirementsBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  requirement: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  requirementMet: {
    color: '#10b981',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});