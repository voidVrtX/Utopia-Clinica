# 📲 Sistema de Notificaciones y Captura de Documentos

## ✅ Componentes Implementados

### 1. **DocumentScanner** 📸
**Ubicación:** `src/components/DocumentScanner.tsx`

Componente de captura de documentos con cámara:
- ✓ Solicita permisos de cámara automáticamente
- ✓ Interfaz intuitiva con marco guía
- ✓ Vista previa de foto capturada
- ✓ Botones: Retomar / Confirmar
- ✓ Soporta múltiples tipos de documentos:
  - Cédula de Identidad
  - Cédula Profesional
  - Licencia de Conducción
  - Certificado Académico
  - Diploma

**Uso:**
```tsx
<DocumentScanner
  label="Cédula de Identidad"
  documentType="cedula"
  onCapture={(photoUri) => {
    console.log('Documento guardado:', photoUri);
  }}
/>
```

---

### 2. **NotificationsPanel** 🔔
**Ubicación:** `src/components/NotificationsPanel.tsx`

Panel lateral de notificaciones para administradores:
- ✓ Lista de notificaciones en tiempo real
- ✓ Marcar como leídas
- ✓ Eliminar notificaciones
- ✓ Formato de tiempo relativo (hace 5m, hace 1h, etc)
- ✓ Icono y color según tipo de notificación
- ✓ Badge con contador de no leídas
- ✓ Estado vacío personalizado

**Uso:**
```tsx
const [panelVisible, setPanelVisible] = useState(false);

<NotificationsPanel
  visible={panelVisible}
  onClose={() => setPanelVisible(false)}
/>
```

---

### 3. **NotificationBadge** 🔴
**Ubicación:** `src/components/NotificationBadge.tsx`

Badge de notificaciones para barra de navegación:
- ✓ Muestra contador de no leídas
- ✓ Actualiza en tiempo real
- ✓ Icono de campana
- ✓ Fácil integración en headers

**Uso:**
```tsx
<NotificationBadge onPress={() => setPanelVisible(true)} />
```

---

## 📊 Servicio de Notificaciones

**Ubicación:** `src/services/notificationService.ts`

### Métodos Disponibles

```typescript
// Notificar nuevo médico registrado
notificationManager.notifyDoctorRegistered(
  doctorName: string,
  doctorId: string,
  email: string
)

// Notificar nuevo paciente registrado
notificationManager.notifyPatientRegistered(
  patientName: string,
  patientId: string,
  email: string
)

// Notificar verificación de documento
notificationManager.notifyDocumentVerified(
  doctorName: string,
  documentType: string
)

// Enviar alerta personalizada
notificationManager.notifyAlert(
  title: string,
  message: string
)

// Marcar notificación como leída
notificationManager.markAsRead(notificationId: string)

// Eliminar notificación
notificationManager.delete(notificationId: string)

// Obtener todas las notificaciones
notificationManager.getAll(): Notification[]

// Obtener no leídas
notificationManager.getUnread(): Notification[]

// Contar no leídas
notificationManager.getUnreadCount(): number

// Limpiar antiguas (30 días por defecto)
notificationManager.clearOldNotifications(daysOld: number)
```

---

## 🎯 Casos de Uso Implementados

### 1. **Registrar Nuevo Médico**
```typescript
// En RegistrarMedicoScreen
notificationManager.notifyDoctorRegistered(
  nombre,
  `doctor_${Date.now()}`,
  email
);
notificationManager.notifyDocumentVerified(nombre, 'Cédula y Cédula Profesional');
```

### 2. **Registrar Nuevo Paciente**
```typescript
// En RegisterStep3Screen (después de confirmar registro)
notificationManager.notifyPatientRegistered(
  draft.nombre,
  `patient_${Date.now()}`,
  draft.email
);
```

### 3. **Alertas Personalizadas**
```typescript
notificationManager.notifyAlert(
  '✅ Cédula capturada',
  'Se guardó correctamente'
);
```

---

## 🔌 Integración en Vistas

### AdminNavigator/AdminTabs
```tsx
import NotificationBadge from '../../components/NotificationBadge';
import NotificationsPanel from '../../components/NotificationsPanel';

export default function AdminTabs({ navigation }) {
  const [panelVisible, setPanelVisible] = useState(false);

  return (
    <>
      <Tab.Navigator>
        {/* Tabs aquí */}
      </Tab.Navigator>

      <NotificationBadge onPress={() => setPanelVisible(true)} />
      <NotificationsPanel
        visible={panelVisible}
        onClose={() => setPanelVisible(false)}
      />
    </>
  );
}
```

### RegistrarMedicoScreen
```tsx
import DocumentScanner from '../../components/DocumentScanner';
import { notificationManager } from '../../services/notificationService';

// Ya integrado en la pantalla actual
```

---

## 📝 Tipos de Notificaciones

```typescript
type NotificationType = 
  | 'doctor_registered'      // Nuevo médico
  | 'patient_registered'     // Nuevo paciente
  | 'document_verified'      // Documento verificado
  | 'alert'                  // Alerta personalizada
```

---

## 🎨 Características Visuales

- **Colores por tipo:**
  - 👨‍⚕️ Médico: Verde primario
  - 👤 Paciente: Púrpura
  - ✅ Documento: Verde oscuro
  - ⚠️ Alerta: Naranja

- **Iconos:**
  - Medical / Person / CheckmarkDone / AlertCircle

- **Estados:**
  - Leída (gris)
  - No leída (fondo azul con línea izquierda)
  - Hover (ligeramente más oscuro)

---

## 📸 Flujo de Captura de Documentos

```
Tap en DocumentScanner
    ↓
Solicitar permisos de cámara
    ↓
Mostrar vista de cámara con marco guía
    ↓
Usuario toma foto
    ↓
Mostrar vista previa
    ↓
Retomar o Confirmar
    ↓
callback onCapture(uri)
```

---

## 🔐 Permisos Requeridos

### iOS
```plist
NSCameraUsageDescription = "Utopía usa la cámara para capturar documentos"
```

### Android
```xml
<uses-permission android:name="android.permission.CAMERA" />
```

---

## 🚀 Funcionalidades Futuras

1. **Notificaciones Push**
   - Integración con Firebase/OneSignal
   - Alertas en tiempo real

2. **Almacenamiento de Documentos**
   - Guardar en base de datos
   - Análisis OCR automático

3. **Auditoría**
   - Historial de acciones
   - Log de cambios

4. **Filtros de Notificaciones**
   - Por tipo
   - Por fecha
   - Por usuario

5. **Exportar Notificaciones**
   - PDF
   - CSV

6. **Emails Automáticos**
   - Confirmación de registro
   - Notificaciones por correo

7. **Dashboard de Administrador**
   - Gráficos de registros
   - Estadísticas de uso

---

## 📋 Checklist de Integración

- [ ] Importar `DocumentScanner` en pantalla de registro
- [ ] Importar `NotificationBadge` y `NotificationsPanel` en AdminTabs
- [ ] Llamar `notificationManager.notify*` cuando corresponda
- [ ] Verificar permisos de cámara en app.json
- [ ] Probar captura de documentos en dispositivo real
- [ ] Probar notificaciones en tiempo real
- [ ] Documentar URIs de fotos en BD

---

Última actualización: 2026-07-14
