# Utopía Clínica — App móvil (Expo + React Native + TypeScript)

App multi-rol para la clínica **Utopía** construida con **Expo SDK 57**, **React Native 0.86** y **TypeScript**, organizada en una arquitectura **MVVC** (Model – View – ViewModel – Controller), con backend real en **Node.js/Express + PostgreSQL**.

## Roles y cuentas de prueba

Todos los roles inician sesión desde la **misma pantalla de login**. Solo los **pacientes** pueden registrarse ellos mismos; a los médicos los da de alta el administrador, y admin/farmacia son cuentas fijas predefinidas.

| Rol       | Correo                        | Contraseña  |
|-----------|--------------------------------|-------------|
| Admin     | arlette_admin@utopia.com       | Utopia123   |
| Paciente  | osbaldo_paciente@utopia.com    | Utopia123   |
| Médico    | tovar_medico@utopia.com        | Utopia123   |
| Farmacia  | adan_farmacia@utopia.com       | Utopia123   |

> Los datos se guardan en **PostgreSQL** vía la API en `backend/`. No hay base de datos simulada en el cliente: la app consume la API real (`src/services/apiClient.ts`).

## Instalación

### 1. Backend (API + PostgreSQL)

Ver instrucciones completas en [`backend/README.md`](./backend/README.md). Resumen rápido:

```bash
cd backend
npm install
cp .env.example .env    # ajusta credenciales de tu PostgreSQL local
npm run db:setup        # crea tablas (schema.sql) y siembra datos de prueba
npm run dev              # API en http://localhost:4000/api
```

### 2. App móvil (Expo)

```bash
npm install
npx expo install --fix    # alinea versiones exactas de dependencias nativas con SDK 57

# Apunta la app a tu backend (usa tu IP de red local, no localhost, si pruebas en un dispositivo físico)
# .env o variable de entorno:
# EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:4000/api

npx expo start
```

Escanea el QR con **Expo Go** (SDK 57) o corre en un simulador:

```bash
npx expo start --ios
npx expo start --android
```

> **Builds nativas (EAS o `gradlew`)**: `EXPO_PUBLIC_API_URL` se hornea en tiempo de build. Si no lo defines como variable de entorno del build, la app cae al fallback `http://localhost:4000/api`, que no es alcanzable desde un dispositivo real. Defínela en tu perfil de `eas.json` (`env`) o expórtala antes de correr `gradlew assembleRelease`.

## Arquitectura MVVC
src/
models/         # Model: tipos de datos puros (User, Cita, Receta, Medicamento, Aviso)
services/       # Acceso a datos (apiClient hacia el backend) y sensores (ubicación, huella, orientación)
controllers/    # Controller: reglas de negocio (AuthController, CitasController, RecetasController…)
viewmodels/     # ViewModel: hooks de React que exponen estado + acciones a las vistas
context/        # Estado global (sesión de usuario, borrador de registro)
views/          # View: pantallas (paciente/, medico/, admin/, farmacia/, auth/, shared/)
components/     # Componentes de UI reutilizables
navigation/     # Stacks y tabs de React Navigation por rol
theme/          # Colores, tipografía, espaciados
utils/          # Helpers puros (fechas, distancias, ids)
backend/
src/
config/db.js        # Pool de conexión pg
db/schema.sql        # DDL: enums, tablas, índices, triggers
db/migrate.js        # Ejecuta schema.sql contra la BD
db/seed.js            # Datos de prueba (usuarios, citas, recetas, avisos)
middleware/           # auth (JWT + roles), errorHandler
controllers/          # Lógica de negocio por entidad
routes/                # Endpoints Express
utils/serializers.js  # snake_case (BD) -> camelCase (modelos TS de la app)

- **Model**: `src/models/*.ts` — interfaces de `Paciente`, `Medico`, `Admin`, `Farmacia`, `Cita`, `Receta`, `Medicamento`, `Aviso`.
- **View**: `src/views/**` — componentes de pantalla, sin lógica de negocio, solo presentación + llamado a un ViewModel.
- **ViewModel**: `src/viewmodels/*.ts` — hooks (`useMisCitasViewModel`, `useAgendaMedicaViewModel`, `useCrearRecetaViewModel`, etc.) que llaman a los Controllers y exponen `state`/`acciones` listos para pintar.
- **Controller**: `src/controllers/*.ts` — lógica de negocio pura (agendar, cancelar, invalidar/entregar receta, crear médico, login…), sin JSX, reusable y testeable.

## Sensores utilizados

1. **Ubicación** (`expo-location`, `src/services/locationService.ts`): en la pantalla de Inicio del paciente se muestra un banner con la distancia (km) hacia Utopía Clínica (Vertice Manzana 038, Progreso, 50150 Toluca de Lerdo, Méx.), calculada con la fórmula de Haversine.
2. **Giroscopio / orientación** (`expo-screen-orientation` + `useWindowDimensions`, `src/services/orientationService.ts`): la app desbloquea la rotación libre del dispositivo y todas las pantallas usan layouts responsivos que se adaptan entre vertical y horizontal.
3. **Huella dactilar / Face ID** (`expo-local-authentication`, `src/services/biometricService.ts` + `src/components/BiometricPrompt.tsx`): al cerrar y reabrir la app, si hubo una sesión previa, se muestra un modal para continuar con huella y reingresar automáticamente a la última cuenta usada (`SessionContext`).
4. **Cámara** (`expo-camera`, `src/components/CameraScanner.tsx` y `src/components/DocumentScanner.tsx`): usada por **Farmacia** para escanear el QR de recetas, y en captura de documentos (cédulas/certificados de médicos). El escáner se remonta automáticamente al tomar foco de pantalla (`useFocusEffect` + `key`) para evitar el bug conocido de pantalla negra en Android tras una sesión de cámara "stale".

## Flujo de recetas con QR y checklist de entrega

1. El **médico** completa una consulta y arma la receta en `CrearRecetaScreen`, agregando medicamentos uno por uno mediante `MedicamentoPicker` (buscador con autocompletar contra el catálogo `medicamentos_catalogo`, con opción de texto libre si el medicamento no está en el catálogo) → se genera un código QR único (`RecetasController.crear`).
2. El **paciente** ve su receta con el QR en `Mis recetas → Ver receta`.
3. La **farmacia** escanea el QR (`EscanearRecetaScreen`, navegación directa sin pasos intermedios) y llega a un **checklist de medicamentos** (`ConfirmarInvalidacionScreen`) con un checkbox por cada uno.
4. Al presionar **"Completado"**:
   - Los medicamentos marcados quedan como entregados.
   - Los **no marcados** se registran como agotados, y el sistema **genera automáticamente una nueva receta** (nuevo QR válido) solo con esos medicamentos faltantes, para que el paciente la canjee después.
   - La receta original queda **invalidada** (`PATCH /recetas/:id/entrega`) y su QR no puede reutilizarse.
   - Se envía un **aviso** al paciente notificando la receta de reposición.

## Reportes y exportación (Admin)

Desde `ReportesScreen` / `ReporteDetalleScreen` el administrador exporta reportes reales (citas, cancelaciones, pacientes, médicos) en **PDF** (PDFKit) y **Excel** (ExcelJS), generados por el backend (`backend/src/controllers/export.controller.js`) y descargados/compartidos en el dispositivo vía `expo-file-system/legacy` + `expo-sharing`.

## Notas

- El calendario de agendar/modificar citas y la franja semanal de agenda médica están construidos a mano (`CalendarPicker.tsx`, `WeekStrip.tsx`) sin dependencias externas de calendario.
- Endpoints completos, variables de entorno del backend y estructura de la API en [`backend/README.md`](./backend/README.md).
- Este repo incluye una carpeta `android/` generada con `expo prebuild` para builds nativas locales (`gradlew assembleRelease`). Si modificas `app.json` (permisos, plugins), vuelve a correr `npx expo prebuild --clean` antes de compilar para mantenerla sincronizada.