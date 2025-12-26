import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from './src/types/navigation';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabs from './src/navigation/MainTabs';
import NewAppointmentScreen from './src/screens/NewAppointmentScreen';
import NewClientScreen from './src/screens/NewClientScreen';
import QuoteScreen from './src/screens/QuoteScreen';
import ClientDetailScreen from './src/screens/ClientDetailScreen';
import FolderDetailScreen from './src/screens/FolderDetailScreen';
import PriceManagementScreen from './src/screens/PriceManagementScreen';
import ExportPDFScreen from './src/screens/ExportPDFScreen';
import NotificationManagementScreen from './src/screens/NotificationManagementScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';

// Services
import { localAuth } from './src/lib/localAuthService';
import { initializeAppointments } from './src/lib/appointmentService';
import { initializeClients } from './src/lib/clientService';
import { initializeCatalog } from './src/lib/catalogService';
import { initializePrices } from './src/lib/priceService';
import { initializeTemplates } from './src/lib/messageTemplateService';
import { initializeStudioData } from './src/lib/studioService';
import { setupNotificationListeners, refreshAllNotifications } from './src/lib/notificationScheduler';

// Default data
import {
  defaultClients,
  defaultAppointments,
  defaultPriceCategories,
  defaultMessageTemplates,
  defaultStudioData,
} from './src/lib/defaultData';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Inicializar autenticación
      await localAuth.initialize();
      const currentUser = localAuth.getUser();
      setIsAuthenticated(localAuth.isAuthenticated());

      // Solo inicializar datos mock si es el usuario admin por defecto
      if (currentUser && currentUser.id === 'user_default') {
        await initializeAppointments(defaultAppointments);
        await initializeClients(defaultClients);
        await initializePrices(defaultPriceCategories);
        await initializeTemplates(defaultMessageTemplates);
        await initializeStudioData(defaultStudioData);
      } else if (currentUser) {
        // Para usuarios nuevos, inicializar con datos vacíos/defaults
        await initializeAppointments([]);
        await initializeClients([]);
        await initializePrices(defaultPriceCategories); // Precios por defecto para todos
        await initializeTemplates(defaultMessageTemplates); // Plantillas por defecto
        await initializeStudioData(defaultStudioData); // Studio data básico
      }
      
      // Catálogo siempre inicia vacío
      await initializeCatalog();

      // Configurar listeners de notificaciones
      setupNotificationListeners();

      // Refrescar notificaciones programadas
      await refreshAllNotifications();

      setIsInitialized(true);

      // Listener de cambios de autenticación
      const unsubscribe = localAuth.onAuthStateChange((user) => {
        setIsAuthenticated(!!user);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error inicializando app:', error);
      setIsInitialized(true); // Continuar aunque haya error
    }
  };

  if (isAuthenticated === null || !isInitialized) {
    return (
      <View style={styles.loadingContainer}>
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
              <Stack.Screen 
                name="ClientDetail" 
                component={ClientDetailScreen}
                options={{ 
                  headerShown: false,
                }}
              />
              <Stack.Screen 
                name="FolderDetail" 
                component={FolderDetailScreen}
                options={{ 
                  headerShown: false,
                }}
              />
              <Stack.Screen 
                name="PriceManagement" 
                component={PriceManagementScreen}
                options={{ 
                  headerShown: false,
                }}
              />
              <Stack.Screen 
                name="ExportPDF" 
                component={ExportPDFScreen}
                options={{ 
                  headerShown: false,
                }}
              />
              <Stack.Screen 
                name="NotificationManagement" 
                component={NotificationManagementScreen}
                options={{ 
                  headerShown: false,
                }}
              />
              <Stack.Screen 
                name="ChangePassword" 
                component={ChangePasswordScreen}
                options={{ 
                  headerShown: false,
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});