# Utopía Clínica — App móvil (Expo + React Native + TypeScript)

App multi-rol para la clínica **Utopía** construida con **Expo SDK 57**, **React Native 0.86** y **TypeScript**, organizada en una arquitectura **MVVC** (Model – View – ViewModel – Controller).

## Roles y cuentas de prueba

Todos los roles inician sesión desde la **misma pantalla de login**. Solo los **pacientes** pueden registrarse ellos mismos; los médicos los da de alta el administrador, y admin/farmacia son cuentas fijas predefinidas.

| Rol       | Correo                        | Contraseña  |
|-----------|--------------------------------|-------------|
| Admin     | arlette_admin@utopia.com       | Utopia123   |
| Paciente  | osbaldo_paciente@utopia.com    | Utopia123   |
| Médico    | tovar_medico@utopia.com        | Utopia123   |
| Farmacia  | adan_farmacia@utopia.com       | Utopia123   |

> La "base de datos" es simulada con `AsyncStorage` (se siembra automáticamente la primera vez que abres la app, ver `src/services/mockDatabase.ts`). No hay backend real: es un prototipo funcional de UI + lógica de negocio en el cliente.

## Instalación

```bash
npm install
npx expo install --fix   # alinea versiones exactas de las dependencias nativas con SDK 57
npx expo start
```

Escanea el QR con **Expo Go** (SDK 57) o corre en un simulador:

```bash
npx expo start --ios
npx expo start --android
```

## Arquitectura MVVC

```
src/
  models/         # Model: tipos de datos puros (User, Cita, Receta, Aviso)
  services/       # Acceso a datos crudo y sensores (AsyncStorage, ubicación, huella, orientación)
  controllers/    # Controller: reglas de negocio (AuthController, CitasController, RecetasController…)
  viewmodels/     # ViewModel: hooks de React que exponen estado + acciones a las vistas
  context/        # Estado global (sesión de usuario, borrador de registro)
  views/          # View: pantallas (paciente/, medico/, admin/, farmacia/, auth/, shared/)
  components/     # Componentes de UI reutilizables
  navigation/     # Stacks y tabs de React Navigation por rol
  theme/          # Colores, tipografía, espaciados
  utils/          # Helpers puros (fechas, distancias, ids)
```

- **Model**: `src/models/*.ts` — interfaces de `Paciente`, `Medico`, `Admin`, `Farmacia`, `Cita`, `Receta`, `Aviso`.
- **View**: `src/views/**` — componentes de pantalla, sin lógica de negocio, solo presentación + llamado a un ViewModel.
- **ViewModel**: `src/viewmodels/*.ts` — hooks (`useMisCitasViewModel`, `useAgendaMedicaViewModel`, etc.) que llaman a los Controllers y exponen `state`/`acciones` listos para pintar.
- **Controller**: `src/controllers/*.ts` — lógica de negocio pura (agendar, cancelar, invalidar receta, crear médico, login…), sin JSX, reusable y testeable.

## Sensores utilizados

1. **Ubicación** (`expo-location`, `src/services/locationService.ts`): en la pantalla de Inicio del paciente se muestra un banner con la distancia (km) hacia Utopía Clínica (Vertice Manzana 038, Progreso, 50150 Toluca de Lerdo, Méx.), calculada con la fórmula de Haversine.
2. **Giroscopio / orientación** (`expo-screen-orientation` + `useWindowDimensions`, `src/services/orientationService.ts`): la app desbloquea la rotación libre del dispositivo (`habilitarRotacionLibre`) y todas las pantallas usan layouts responsivos (`flexWrap`, porcentajes, `ScrollView`) que se adaptan automáticamente entre vertical y horizontal sin perder funcionalidad.
3. **Huella dactilar / Face ID** (`expo-local-authentication`, `src/services/biometricService.ts` + `src/components/BiometricPrompt.tsx`): al cerrar y reabrir la app, si hubo una sesión previa, se muestra un modal para continuar con huella dactilar y reingresar automáticamente a la última cuenta usada (`SessionContext`).
4. **Cámara** (`expo-camera`, `src/components/CameraScanner.tsx`): exclusiva del rol **Farmacia**, para escanear el código QR de las recetas médicas y validarlas/invalidarlas.

## Flujo de recetas con QR

1. El **médico** completa una consulta y genera una receta (`CrearRecetaScreen`) → se crea un código QR único (`RecetasController.crear`).
2. El **paciente** ve su receta con el QR en `Mis recetas → Ver receta`.
3. La **farmacia** escanea el QR (`EscanearRecetaScreen`) y confirma la entrega (`ConfirmarInvalidacionScreen`) → la receta queda **invalidada** (`RecetasController.invalidarPorCodigo`) y no puede volver a usarse.

## Notas

- Los datos de ejemplo (médicos, citas, receta) se siembran una sola vez; para reiniciarlos, borra los datos de la app o cambia la clave `utopia:seeded_v1` en `AsyncStorage`.
- El calendario de agendar/modificar citas y la franja semanal de agenda médica están construidos a mano (`CalendarPicker.tsx`, `WeekStrip.tsx`) sin dependencias externas de calendario.
- Los reportes de administrador (`ReporteDetalleScreen`, `ExportacionScreen`) muestran la interfaz y flujo de exportación (PDF/Excel) de forma simulada, ya que no hay backend real de reportes.
