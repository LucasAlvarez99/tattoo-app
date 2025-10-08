// Tipos de navegación principal
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  AppointmentDetail: { appointmentId: string };
  ClientDetail: { clientId: string };
  NewAppointment: undefined;
  NewClient: undefined;
  QuoteScreen: undefined;
  PriceList: undefined;
  MessageTemplates: undefined;
  Subscription: undefined;
};

// Tipos para el Tab Navigator
export type TabParamList = {
  HomeTab: undefined;
  CalendarTab: undefined;
  ClientsTab: undefined;
  CatalogTab: undefined;
  ProfileTab: undefined;
};