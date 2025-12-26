import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { User } from '../lib/defaultData';

interface SubscriptionCardProps {
  user: User | null;
}

export default function SubscriptionCard({ user }: SubscriptionCardProps) {
  const daysLeft = user?.trialEndsAt 
    ? Math.ceil((user.trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
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
  );
}

const styles = StyleSheet.create({
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
});