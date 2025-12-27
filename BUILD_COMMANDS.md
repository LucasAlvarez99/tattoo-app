# 🛠️ COMANDOS DE BUILD - TATTOO MANAGER

## 🚀 INICIO RÁPIDO

### **Primera vez (Setup inicial)**

```bash
# 1. Instalar EAS CLI globalmente
npm install -g eas-cli

# 2. Login en Expo
eas login

# 3. Configurar proyecto
eas build:configure

# 4. Verificar configuración
eas whoami
```

---

## 📱 BUILDS DE DESARROLLO/TESTING

### **Android APK (para testeo interno)**

```bash
# Build y descarga automática
eas build --platform android --profile preview --local

# O build en la nube (más rápido si tu PC es lenta)
eas build --platform android --profile preview

# Resultado: APK descargable que funciona en cualquier Android
```

**Instalar en dispositivo**:
```bash
# Opción 1: Desde el link que aparece en terminal
# Opción 2: Descargar desde https://expo.dev/accounts/[tu-usuario]/projects/tattoo-app/builds

# Transferir a celular vía cable o compartir link
adb install tattoo-app.apk
```

---

### **iOS IPA (para testeo con TestFlight)**

```bash
# Build para TestFlight
eas build --platform ios --profile preview

# Subir a TestFlight manualmente
# 1. Descargar IPA
# 2. Abrir https://appstoreconnect.apple.com
# 3. TestFlight > agregar build
# 4. Invitar testers
```

---

## 🏪 BUILDS DE PRODUCCIÓN (STORES)

### **Android AAB (Google Play)**

```bash
# Build para Google Play Store
eas build --platform android --profile production

# Submit automático (necesita credenciales de Google Play)
eas submit --platform android

# O manual:
# 1. Descargar AAB
# 2. Subir en play.google.com/console
# 3. Crear release > Production
```

**Requisitos primera vez**:
```bash
# Generar keystore (EAS lo hace automáticamente)
# Si querés hacerlo manual:
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

---

### **iOS AAB (App Store)**

```bash
# Build para App Store
eas build --platform ios --profile production

# Submit automático
eas submit --platform ios

# Manual:
# 1. Descargar IPA
# 2. Usar Transporter app (macOS)
# 3. Subir a App Store Connect
```

---

## 🔄 UPDATES OVER-THE-AIR (OTA)

Actualizar sin rebuild (solo JS/assets):

```bash
# Setup inicial (primera vez)
eas update:configure

# Publicar update
eas update --branch production --message "Fix bug en calendario"

# Rollback si algo sale mal
eas update:rollback --branch production
```

**Usuarios reciben el update automáticamente** al abrir la app (requiere conexión)

---

## 🌍 BUILDS PARA TODAS LAS PLATAFORMAS

```bash
# Build Android + iOS simultáneo
eas build --platform all --profile production

# Submit a ambas stores
eas submit --platform all
```

---

## 🔍 MONITOREO Y DEBUGGING

### **Ver estado de builds**

```bash
# Listar todos los builds
eas build:list

# Ver detalles de un build específico
eas build:view [BUILD_ID]

# Ver logs en tiempo real
eas build:view [BUILD_ID] --logs
```

---

### **Ver updates OTA**

```bash
# Listar updates publicados
eas update:list

# Ver detalles de un update
eas update:view [UPDATE_ID]
```

---

## 🧪 TESTING LOCAL

### **Correr en emulador**

```bash
# Android
npm run android
# O con Expo Go
npx expo start --android

# iOS (solo en Mac)
npm run ios
# O con Expo Go
npx expo start --ios
```

---

### **Correr en dispositivo físico**

```bash
# Iniciar dev server
npx expo start

# Escanear QR con Expo Go app
# Android: Desde Expo Go
# iOS: Desde la app Cámara
```

---

## 📦 PREPARACIÓN DE ASSETS

### **Optimizar imágenes antes de build**

```bash
# Instalar herramienta de optimización
npm install -g @expo/image-utils

# Optimizar íconos
npx @expo/image-utils resize icon.png 1024 1024

# Generar todos los tamaños
npx expo prebuild
```

---

## 🔐 GESTIÓN DE SECRETOS

### **Configurar variables de entorno para EAS**

```bash
# Agregar secretos (no se guardan en código)
eas secret:create --name TWILIO_SID --value "AC1234567890abcdef" --type string
eas secret:create --name TWILIO_TOKEN --value "tu_token_secreto" --type string
eas secret:create --name SENDGRID_KEY --value "SG.tu_key" --type string

# Listar secretos
eas secret:list

# Eliminar secreto
eas secret:delete --name TWILIO_SID
```

**Uso en código**:
```typescript
// Acceder en runtime
const twilioSid = process.env.EXPO_PUBLIC_TWILIO_SID;
```

---

## 📊 ANALYTICS Y MONITOREO

### **Ver stats de usage**

```bash
# Usuarios activos (requiere analytics integrado)
eas analytics

# Crashes (requiere sentry o similar)
eas diagnostics
```

---

## 🐛 TROUBLESHOOTING

### **Build falla constantemente**

```bash
# Limpiar cache y reintentar
eas build --platform android --profile preview --clear-cache

# Rebuild desde cero
rm -rf node_modules package-lock.json
npm install
eas build --platform android --profile preview
```

---

### **App crashea al abrir**

```bash
# Ver logs en tiempo real
npx react-native log-android
# o
npx react-native log-ios

# Verificar dependencias nativas
npx expo-doctor
```

---

### **Updates OTA no llegan**

```bash
# Verificar que el runtime version coincida
# En app.config.js:
{
  runtimeVersion: {
    policy: "sdkVersion" // o versión específica
  }
}

# Re-publicar update
eas update --branch production --message "Force update"
```

---

## 📋 WORKFLOWS COMUNES

### **Desarrollo diario**

```bash
# Día típico de desarrollo
npx expo start           # Levantar servidor dev
# Hacer cambios en código
# Ver cambios en tiempo real en Expo Go
```

---

### **Release semanal (testeo interno)**

```bash
# Viernes: Build de preview
eas build --platform android --profile preview

# Compartir APK con equipo
# Recopilar feedback
# Fix bugs el lunes
```

---

### **Release mensual (producción)**

```bash
# 1. Actualizar versión en app.config.js
# version: "1.2.0"
# android.versionCode: 3

# 2. Build de producción
eas build --platform all --profile production

# 3. Submit a stores
eas submit --platform all

# 4. Monitorear aprobación
# Google Play: 1-3 días
# App Store: 1-7 días
```

---

### **Hotfix urgente**

```bash
# Solo para fix de JS/assets (no código nativo)
# 1. Fix el bug
# 2. Publicar OTA
eas update --branch production --message "HOTFIX: arreglo crítico"

# Los usuarios reciben el fix en minutos
```

---

## 🎯 CHECKLIST PRE-BUILD

Antes de cada build de producción, verificá:

```bash
# ✅ Versión actualizada
# app.config.js → version: "X.Y.Z"

# ✅ Tests pasando
npm test

# ✅ Código limpio
npm run lint

# ✅ Assets optimizados
# Verificar que icon.png, splash.png estén OK

# ✅ Variables de entorno configuradas
eas secret:list

# ✅ Changelog actualizado
# CHANGELOG.md con cambios de esta versión
```

---

## 💾 BACKUP ANTES DE BUILD IMPORTANTE

```bash
# Hacer backup del proyecto
git tag v1.2.0
git push origin v1.2.0

# Backup de configuración
cp eas.json eas.json.backup
cp app.config.js app.config.js.backup
```

---

## 🆘 COMANDOS DE EMERGENCIA

### **Cancelar build en progreso**

```bash
eas build:cancel [BUILD_ID]
```

---

### **Revertir update OTA**

```bash
# Volver a versión anterior
eas update:rollback --branch production
```

---

### **Descargar todos los builds**

```bash
# Útil para backup
eas build:list --limit 50 --json > builds-backup.json
```

---

## 📖 RECURSOS ÚTILES

**Documentación oficial**:
- EAS Build: https://docs.expo.dev/build/introduction/
- EAS Submit: https://docs.expo.dev/submit/introduction/
- EAS Update: https://docs.expo.dev/eas-update/introduction/

**Comunidad**:
- Discord de Expo: https://chat.expo.dev
- Forums: https://forums.expo.dev
- Stack Overflow: tag `expo`

---

## 🎬 COMANDOS COPY-PASTE RÁPIDOS

```bash
# Setup completo primera vez
npm install -g eas-cli && eas login && eas build:configure

# Build Android preview
eas build -p android --profile preview

# Build iOS preview
eas build -p ios --profile preview

# Build producción ambas plataformas
eas build -p all --profile production

# Update OTA
eas update --branch production -m "Actualización"

# Ver último build
eas build:list --limit 1

# Monitorear build actual
eas build:view --logs
```

---

**¡Todo listo para buildear!** 🚀