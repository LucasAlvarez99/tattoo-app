import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from './src/types/navigation';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabs from './src/navigation/MainTabs';
import NewAppointmentScreen from './src/screens/NewAppointmentScreen';
import NewClientScreen from './src/screens/NewClientScreen';
import QuoteScreen from './src/screens/QuoteScreen';
import { mockAuth } from './src/lib/mockAuth';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    mockAuth.initialize();
    setIsAuthenticated(mockAuth.isAuthenticated());

    const unsubscribe = mockAuth.onAuthStateChange((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {!isAuthenticated ? (
            <>
              <Stack.Screen 
                name="Login" 
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Register" 
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
              <Stack.Screen 
                name="MainTabs" 
                component={MainTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="NewAppointment" 
                component={NewAppointmentScreen}
                options={{ 
                  title: 'Nueva Cita',
                  presentation: 'modal',
                }}
              />
              <Stack.Screen 
                name="NewClient" 
                component={NewClientScreen}
                options={{ 
                  title: 'Nuevo Cliente',
                  presentation: 'modal',
                }}
              />
              <Stack.Screen 
                name="QuoteScreen" 
                component={QuoteScreen}
                options={{ 
                  title: 'Cotizar Tatuaje',
                  presentation: 'modal',
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}