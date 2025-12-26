import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User } from '../lib/defaultData';

interface ProfileHeaderProps {
  user: User | null;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
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
  );
}

const styles = StyleSheet.create({
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
});