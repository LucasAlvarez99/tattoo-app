import { NavigatorScreenParams } from '@react-navigation/native';

// Tipos para el Stack principal
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>;
  NewAppointment: { clientId?: string };
  NewClient: undefined;
  QuoteScreen: undefined;
  AppointmentDetail: { appointmentId: string };
  ClientDetail: { clientId: string };
  FolderDetail: { 
    folderId: string; 
    folderName: string; 
    folderColor: string;
  };
  PriceManagement: undefined;
  ExportPDF: undefined;
  NotificationManagement: undefined;
  ChangePassword: undefined;
};

// Tipos para el Tab Navigator
export type TabParamList = {
  HomeTab: undefined;
  CalendarTab: undefined;
  ClientsTab: undefined;
  CatalogTab: undefined;
  ProfileTab: undefined;
};