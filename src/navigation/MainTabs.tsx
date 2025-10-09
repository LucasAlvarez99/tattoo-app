import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabParamList } from '../types/navigation';

import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ClientsScreen from '../screens/ClientsScreen';
import CatalogScreen from '../screens/CatalogScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<TabParamList>();

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          paddingBottom: insets.bottom, // 🔥 Respeta el área segura inferior
          paddingTop: 8,
          height: 60 + insets.bottom, // 🔥 Altura dinámica según el dispositivo
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen 
        name="CalendarTab" 
        component={CalendarScreen}
        options={{
          tabBarLabel: 'Agenda',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>📅</Text>,
        }}
      />
      <Tab.Screen 
        name="ClientsTab" 
        component={ClientsScreen}
        options={{
          tabBarLabel: 'Clientes',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>👥</Text>,
        }}
      />
      <Tab.Screen 
        name="CatalogTab" 
        component={CatalogScreen}
        options={{
          tabBarLabel: 'Catálogo',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🎨</Text>,
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}