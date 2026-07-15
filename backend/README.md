# Utopía Clínica — Backend (API REST + PostgreSQL)

API en Node.js/Express con PostgreSQL que reemplaza el `mockDatabase.ts` (AsyncStorage) de la app móvil, manteniendo el mismo modelo de datos (`Paciente`, `Medico`, `Admin`, `Farmacia`, `Cita`, `Receta`, `Aviso`).

## Requisitos

- Node.js 18+
- PostgreSQL 13+ en ejecución

## 1. Crear la base de datos y el usuario

Desde `psql` (como superusuario, p. ej. `postgres`):

```sql
CREATE USER utopia_user WITH PASSWORD '123456';
CREATE DATABASE utopia_clinica OWNER utopia_user;
```

## 2. Configurar variables de entorno

El archivo `.env` ya viene con los datos que enviaste:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=utopia_clinica
DB_USER=utopia_user
DB_PASSWORD=123456

PORT=4000
JWT_SECRET=utopia_clinica_dev_secret_change_me
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
```

> Cambia `JWT_SECRET` por un valor propio antes de usar esto en producción.

## 3. Instalar dependencias

```bash
cd backend
npm install
```

## 4. Crear tablas y sembrar datos de prueba

```bash
npm run migrate   # crea tipos, tablas, índices y triggers (src/db/schema.sql)
npm run seed       # inserta los mismos usuarios/citas/recetas/avisos del mock

# o ambos de una vez:
npm run db:setup
```

Usuarios de prueba creados por el seed (password para todos: `Utopia123`):

| Rol       | Correo                        |
|-----------|--------------------------------|
| Admin     | arlette_admin@utopia.com       |
| Paciente  | osbaldo_paciente@utopia.com    |
| Médico    | tovar_medico@utopia.com        |
| Farmacia  | adan_farmacia@utopia.com       |

## 5. Levantar el servidor

```bash
npm run dev    # con recarga automática (nodemon)
npm start      # producción
```

La API queda en `http://localhost:4000/api`.

## Estructura

```
backend/
  src/
    config/db.js        # Pool de conexión pg, lee las variables DB_* del .env
    db/schema.sql        # DDL: enums, tablas, índices, triggers updated_at
    db/migrate.js        # Ejecuta schema.sql contra la BD
    db/seed.js            # Inserta datos de prueba equivalentes al mock de la app
    middleware/auth.js   # requireAuth (JWT) y requireRole(...roles)
    middleware/errorHandler.js
    controllers/          # Lógica de negocio por entidad
    routes/                # Definición de endpoints Express
    utils/serializers.js  # snake_case (BD) -> camelCase (modelos TS de la app)
    app.js
    server.js
```

## Endpoints principales

| Método | Ruta                              | Auth              | Descripción |
|--------|-------------------------------------|-------------------|-------------|
| POST   | `/api/auth/login`                   | -                 | Login (cualquier rol) |
| POST   | `/api/auth/register`                | -                 | Autorregistro de paciente |
| GET    | `/api/auth/me`                      | Bearer            | Usuario autenticado |
| GET    | `/api/users/:id`                    | Bearer            | Obtener perfil |
| PATCH  | `/api/users/:id`                    | Bearer (propio/admin) | Actualizar perfil |
| GET    | `/api/medicos`                      | -                 | Listar médicos (`?especialidad=&activo=`) |
| POST   | `/api/medicos`                      | admin             | Dar de alta médico |
| PATCH  | `/api/medicos/:id`                  | admin             | Editar médico |
| DELETE | `/api/medicos/:id`                  | admin             | Eliminar médico |
| GET    | `/api/citas`                        | Bearer            | Listar (`?pacienteId=&medicoId=&fecha=&estado=`) |
| POST   | `/api/citas`                        | Bearer            | Agendar cita |
| PATCH  | `/api/citas/:id`                    | Bearer            | Modificar cita |
| PATCH  | `/api/citas/:id/cancelar`           | Bearer            | Cancelar cita |
| GET    | `/api/recetas`                      | Bearer            | Listar (`?pacienteId=&medicoId=`) |
| GET    | `/api/recetas/qr/:codigoQR`         | farmacia/admin    | Buscar receta por código QR |
| POST   | `/api/recetas`                      | medico            | Crear receta (genera QR único) |
| PATCH  | `/api/recetas/:id/invalidar`        | farmacia          | Invalidar receta al entregarla |
| GET    | `/api/avisos`                       | Bearer            | Listar (`?paraUserId=&leido=`) |
| POST   | `/api/avisos`                       | Bearer            | Crear aviso |
| PATCH  | `/api/avisos/:id/leido`             | Bearer            | Marcar como leído |

Todas las rutas protegidas esperan el header `Authorization: Bearer <token>` devuelto por `/api/auth/login`.
