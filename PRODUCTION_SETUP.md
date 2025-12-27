# 🚀 TATTOO MANAGER - GUÍA DE PRODUCCIÓN

## 📋 ÍNDICE
1. [Preparación del Proyecto](#preparación-del-proyecto)
2. [Build para Android](#build-para-android)
3. [Build para iOS](#build-para-ios)
4. [Distribución](#distribución)
5. [Features Pendientes](#features-pendientes)
6. [Variables de Entorno](#variables-de-entorno)

---

## 🔧 PREPARACIÓN DEL PROYECTO

### **Paso 1: Instalar dependencias faltantes**

Las siguientes dependencias son **SIMULADAS** en desarrollo pero necesarias en producción:

```bash
# PDF Generation (si querés exportar PDFs reales)
npm install react-native-html-to-pdf
npm install react-native-share

# Clipboard (para copiar texto)
npm install @react-native-clipboard/clipboard

# Si querés agregar encriptación de contraseñas
npm install expo-secure-store
```

---

### **Paso 2: Activar funcionalidades reales**

#### **A. Exportación de PDFs**

**Archivo**: `src/screens/ExportPDFScreen.tsx`

```typescript
// ❌ COMENTAR esta simulación (línea ~180):
setTimeout(() => {
  Alert.alert('✅ PDF Generado (Simulación)', ...);
}, 2000);

// ✅ DESCOMENTAR el código real (línea ~150):
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

const file = await RNHTMLtoPDF.convert(options);
await Share.open({
  url: `file://${file.filePath}`,
  type: 'application/pdf',
  title: 'Compartir PDF',
});
```

---

#### **B. Notificaciones Push**

**Estado actual**: Solo funcionan en **build nativo**, NO en Expo Go.

**Archivo**: `src/lib/notificationScheduler.ts`

Las notificaciones ya están implementadas correctamente. Verificá:
- ✅ `expo-notifications` está instalado
- ✅ Permisos configurados en `app.config.js`
- ✅ Scheduler programado en `App.tsx`

**Acción requerida**: 
- Hacer un **EAS Build** para testear notificaciones (no funcionan en Expo Go)

---

#### **C. Mensajería automática (WhatsApp/Email)**

**Para producción real**, configurá APIs de terceros:

**Archivo**: `src/lib/notificationService.ts`

```typescript
// Configurar Twilio para WhatsApp
export const NOTIFICATION_CONFIG = {
  whatsapp: {
    enabled: true, // ✅ Cambiar a true
    apiUrl: 'https://api.twilio.com/2010-04-01/Accounts',
    accountSid: process.env.EXPO_PUBLIC_TWILIO_SID, // Agregar en .env
    authToken: process.env.EXPO_PUBLIC_TWILIO_TOKEN,
    fromNumber: 'whatsapp:+14155238886',
  },
  email: {
    enabled: true, // ✅ Cambiar a true
    apiUrl: 'https://api.sendgrid.com/v3/mail/send',
    apiKey: process.env.EXPO_PUBLIC_SENDGRID_KEY, // Agregar en .env
    fromEmail: 'noreply@tuestudio.com',
  },
};
```

**Crear archivo `.env`**:
```bash
EXPO_PUBLIC_TWILIO_SID=tu_account_sid
EXPO_PUBLIC_TWILIO_TOKEN=tu_auth_token
EXPO_PUBLIC_SENDGRID_KEY=tu_api_key
```

---

## 🤖 BUILD PARA ANDROID

### **Opción 1: APK para testeo (Interno)**

```bash
# 1. Configurar EAS (primera vez)
npm install -g eas-cli
eas login

# 2. Generar APK de preview
eas build --platform android --profile preview

# 3. Descargar APK cuando termine
# Link aparece en la terminal y en expo.dev
```

**Resultado**: APK instalable en cualquier Android (sin Google Play)

---

### **Opción 2: AAB para Google Play (Producción)**

```bash
# 1. Build de producción
eas build --platform android --profile production

# 2. Subir a Google Play Console
# - Crear cuenta de desarrollador ($25 único)
# - Subir AAB en "Releases" > "Production"
# - Completar store listing
# - Enviar a revisión (demora 1-3 días)
```

**Requisitos Google Play**:
- Cuenta de desarrollador: **$25 USD** (pago único)
- Completar: Descripción, screenshots, íconos, política de privacidad

---

## 🍎 BUILD PARA iOS

### **Opción 1: IPA para testeo (TestFlight)**

```bash
# 1. Build de preview
eas build --platform ios --profile preview

# 2. Subir a App Store Connect > TestFlight
# 3. Invitar testers internos/externos
```

**Requisitos**:
- Apple Developer Account: **$99 USD/año**
- Certificados y provisioning profiles (EAS lo maneja automáticamente)

---

### **Opción 2: Build para App Store (Producción)**

```bash
# 1. Build de producción
eas build --platform ios --profile production

# 2. Subir a App Store Connect
# 3. Completar metadata y screenshots
# 4. Enviar a revisión (demora 1-7 días)
```

---

## 📲 DISTRIBUCIÓN SIN STORES

### **Opción A: Expo Updates (Over-The-Air)**

Actualizaciones instantáneas sin reinstalar:

```bash
# 1. Configurar updates
eas update:configure

# 2. Publicar actualización
eas update --branch production --message "Nueva versión 1.1"
```

**Ventaja**: Usuarios reciben updates automáticamente
**Limitación**: Solo actualiza JavaScript/assets, no código nativo

---

### **Opción B: Distribución directa (APK)**

Para distribución interna sin Google Play:

```bash
# 1. Generar APK
eas build --platform android --profile preview

# 2. Compartir link de descarga (válido 30 días)
# O subir APK a tu propio servidor/Google Drive
```

**Usuarios Android**: Habilitar "Instalar apps de fuentes desconocidas"

---

## ⚙️ CONFIGURACIÓN AVANZADA

### **1. Actualizar versión**

**Archivo**: `app.config.js`

```javascript
export default {
  expo: {
    version: "1.2.0", // ✅ Incrementar para cada release
    android: {
      versionCode: 2, // ✅ Auto-incrementa en producción
    },
    ios: {
      buildNumber: "1.2.0",
    },
  }
}
```

---

### **2. Configurar íconos y splash**

Reemplazá estos archivos con tus diseños:
```
assets/
  ├── icon.png (1024x1024)
  ├── splash-icon.png (1200x1200)
  ├── adaptive-icon.png (1024x1024, Android)
  └── favicon.png (48x48, Web)
```

**Herramienta recomendada**: https://icon.kitchen

---

### **3. Modo offline**

Ya está implementado con **AsyncStorage**. Todo funciona offline:
- ✅ Citas, clientes, precios
- ✅ Catálogo de diseños
- ✅ Plantillas de mensajes

---

### **4. Backup de datos**

**TODO**: Implementar backup a la nube (próxima feature)

Opciones:
- Supabase (gratis hasta cierto límite)
- Firebase (gratis con límites)
- Export/Import manual a JSON

---

## 🔐 SEGURIDAD PARA PRODUCCIÓN

### **1. Encriptar contraseñas**

**Archivo**: `src/lib/localAuthService.ts`

```typescript
// ❌ ACTUAL: Contraseñas en texto plano
password: 'admin'

// ✅ PRODUCCIÓN: Usar expo-secure-store + bcrypt
import * as SecureStore from 'expo-secure-store';
import bcrypt from 'bcryptjs';

// Guardar
const hash = await bcrypt.hash(password, 10);
await SecureStore.setItemAsync('user_password', hash);

// Verificar
const stored = await SecureStore.getItemAsync('user_password');
const match = await bcrypt.compare(password, stored);
```

---

### **2. Ocultar API Keys**

**NUNCA** commitear `.env` con keys reales:

```bash
# .gitignore
.env
.env.local
.env.production
```

Usar variables de entorno en EAS:

```bash
eas secret:create --name TWILIO_SID --value "tu_sid"
eas secret:create --name TWILIO_TOKEN --value "tu_token"
```

---

## 📊 ANALYTICS (OPCIONAL)

Para trackear uso de la app:

```bash
npm install expo-firebase-analytics
# o
npm install @react-native-firebase/analytics
```

**Eventos a trackear**:
- Citas creadas
- Clientes agregados
- PDFs exportados
- Cotizaciones generadas

---

## ✅ CHECKLIST PRE-LANZAMIENTO

### **Testing**
- [ ] Probar en dispositivo físico Android
- [ ] Probar en dispositivo físico iOS
- [ ] Verificar notificaciones push
- [ ] Testear flujo completo de usuario nuevo
- [ ] Verificar que datos persistan después de cerrar app

### **Legal**
- [ ] Crear política de privacidad
- [ ] Crear términos y condiciones
- [ ] Cumplir GDPR/LGPD si aplicable

### **Marketing**
- [ ] Screenshots para stores (mínimo 3-5)
- [ ] Descripción optimizada para SEO
- [ ] Video de preview (opcional pero recomendado)
- [ ] Sitio web o landing page

### **Monetización**
- [ ] Integrar pagos (Stripe/MercadoPago)
- [ ] Configurar suscripciones
- [ ] Implementar sistema de trials

---

## 🚀 COMANDOS RÁPIDOS

```bash
# Build y publicar todo de una
eas build --platform all --profile production
eas submit --platform all

# Ver builds en progreso
eas build:list

# Logs de errores
eas build:view [BUILD_ID]

# Actualización OTA rápida
eas update --branch production --message "Fix crítico"
```

---

## 💰 COSTOS APROXIMADOS

| Servicio | Costo | Frecuencia |
|----------|-------|------------|
| Google Play Developer | $25 | Único |
| Apple Developer | $99 | Anual |
| EAS Build (paid plan) | $29/mes | Mensual |
| Twilio WhatsApp | ~$0.005/msg | Por uso |
| SendGrid Email | Gratis hasta 100/día | - |
| Hosting app (Expo) | Gratis | - |

**Total inicial**: ~$150 USD para ambas stores + primer año

---

## 📞 SOPORTE

**Problemas comunes**:

1. **"Build failed"** → Revisar logs: `eas build:view [BUILD_ID]`
2. **Notificaciones no llegan** → Verificar permisos en `app.config.js`
3. **APK no instala** → Habilitar "Fuentes desconocidas" en Android

**Recursos útiles**:
- [Expo Docs](https://docs.expo.dev)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [React Native Docs](https://reactnative.dev)

---

## 🎯 ROADMAP POST-LANZAMIENTO

**Versión 1.1** (Próximas 2 semanas):
- [ ] Backup automático a la nube
- [ ] Dashboard con gráficos
- [ ] Sistema de seña/adelantos
- [ ] Dark mode

**Versión 1.2** (Próximo mes):
- [ ] Multi-idioma (EN/PT)
- [ ] Integración con Instagram API
- [ ] Galería pública de portfolio
- [ ] Programa de referidos

**Versión 2.0** (Próximos 3 meses):
- [ ] Versión web (React)
- [ ] Sincronización multi-dispositivo
- [ ] Sistema de turnos online
- [ ] Integraciones con mercado pago

---

## 📝 NOTAS FINALES

- **Expo Go** es solo para desarrollo, usuarios finales necesitan build nativo
- **EAS Build** gratuito tiene límites (1 build simultáneo)
- Primeros builds demoran ~20-30 minutos
- iOS requiere Mac para desarrollo local (EAS no)
- Android es más fácil y rápido de publicar

**¡Éxito con el lanzamiento!** 🚀