-- Esquema PostgreSQL para Utopía Clínica
-- Basado en src/models/{User,Cita,Receta,Aviso}.ts de la app móvil
--
-- Una tabla base "usuarios" con los datos comunes de autenticación/perfil,
-- y una tabla de extensión por rol (pacientes/medicos/administradores/
-- farmacias) que solo guarda lo específico de ese rol. Evita columnas
-- vacías cruzadas entre roles y deja el esquema documentar quién es quién.

-- gen_random_uuid() es nativo desde PostgreSQL 13, no requiere pgcrypto.

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('paciente', 'medico', 'admin', 'farmacia');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE sexo_type AS ENUM ('Masculino', 'Femenino', 'Otro');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE estado_cita AS ENUM (
    'Confirmada', 'Pendiente', 'En consulta', 'En sala de espera', 'Completada', 'Cancelada'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tipo_aviso AS ENUM (
    'Cita Confirmada', 'Recordatorio', 'Cita Modificada', 'Cita Cancelada',
    'Correo Enviado', 'Mantenimiento programado'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- USUARIOS (datos comunes de autenticación/perfil para los 4 roles)
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               VARCHAR(255) NOT NULL UNIQUE,
  password_hash       TEXT NOT NULL,
  role                user_role NOT NULL,
  nombre              VARCHAR(150) NOT NULL,
  apellido_paterno    VARCHAR(100),
  apellido_materno    VARCHAR(100),
  telefono            VARCHAR(30),
  fecha_nacimiento    DATE,
  sexo                sexo_type,
  direccion           TEXT,
  avatar_color        VARCHAR(20),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_role ON usuarios(role);

DROP TRIGGER IF EXISTS trg_usuarios_updated_at ON usuarios;
CREATE TRIGGER trg_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- PACIENTES (extiende usuarios)
-- ============================================================
CREATE TABLE IF NOT EXISTS pacientes (
  id                  UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  seguro_medico       VARCHAR(100),
  tipo_sangre         VARCHAR(5),
  alergias            TEXT[],
  contacto_emergencia JSONB
);

-- ============================================================
-- MEDICOS (extiende usuarios)
-- ============================================================
CREATE TABLE IF NOT EXISTS medicos (
  id                  UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  especialidad        VARCHAR(100) NOT NULL,
  institucion         VARCHAR(150),
  anios_experiencia   VARCHAR(50),
  sobre_el_medico     TEXT,
  areas_especialidad  TEXT[],
  ubicacion_atencion  TEXT,
  activo              BOOLEAN NOT NULL DEFAULT TRUE,
  valoracion          NUMERIC(2,1),
  num_opiniones       INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_medicos_especialidad ON medicos(especialidad);

-- ============================================================
-- ADMINISTRADORES y FARMACIAS (extienden usuarios; sin campos propios
-- por ahora, pero con tabla dedicada para poder documentar/crecer cada
-- rol de forma independiente sin tocar a los demás).
-- ============================================================
CREATE TABLE IF NOT EXISTS administradores (
  id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS farmacias (
  id UUID PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================
-- Vista de conveniencia: une usuarios con la tabla de su rol para que
-- el backend pueda seguir leyendo "una fila por usuario" con todos sus
-- campos, sin tener que hacer el JOIN correcto en cada consulta.
-- ============================================================
CREATE OR REPLACE VIEW usuarios_completos AS
SELECT
  u.*,
  p.seguro_medico,
  p.tipo_sangre,
  p.alergias,
  p.contacto_emergencia,
  m.especialidad,
  m.institucion,
  m.anios_experiencia,
  m.sobre_el_medico,
  m.areas_especialidad,
  m.ubicacion_atencion,
  m.activo,
  m.valoracion,
  m.num_opiniones
FROM usuarios u
LEFT JOIN pacientes p ON p.id = u.id
LEFT JOIN medicos m ON m.id = u.id;

-- ============================================================
-- CITAS
-- ============================================================
CREATE TABLE IF NOT EXISTS citas (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id          UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  medico_id            UUID NOT NULL REFERENCES medicos(id) ON DELETE CASCADE,
  fecha                DATE NOT NULL,
  hora                 VARCHAR(10) NOT NULL,
  especialidad         VARCHAR(100) NOT NULL,
  consultorio          VARCHAR(50),
  motivo               TEXT,
  estado               estado_cita NOT NULL DEFAULT 'Pendiente',
  notas_paciente       TEXT,
  historial_relevante  TEXT[],
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_citas_paciente ON citas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_citas_medico ON citas(medico_id);
CREATE INDEX IF NOT EXISTS idx_citas_fecha ON citas(fecha);
CREATE INDEX IF NOT EXISTS idx_citas_estado ON citas(estado);

DROP TRIGGER IF EXISTS trg_citas_updated_at ON citas;
CREATE TRIGGER trg_citas_updated_at
  BEFORE UPDATE ON citas
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- RECETAS
-- ============================================================
CREATE TABLE IF NOT EXISTS recetas (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_qr         VARCHAR(120) NOT NULL UNIQUE,
  paciente_id       UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  medico_id         UUID NOT NULL REFERENCES medicos(id) ON DELETE CASCADE,
  cita_id           UUID REFERENCES citas(id) ON DELETE SET NULL,
  fecha             DATE NOT NULL,
  diagnostico       TEXT,
  tratamiento       TEXT,
  observaciones     TEXT,
  presion_arterial  VARCHAR(30),
  temperatura       VARCHAR(20),
  medicamentos      JSONB NOT NULL DEFAULT '[]'::jsonb,
  receta_origen_id  UUID REFERENCES recetas(id) ON DELETE SET NULL,
  valida            BOOLEAN NOT NULL DEFAULT TRUE,
  invalidada_en     TIMESTAMPTZ,
  invalidada_por    UUID REFERENCES farmacias(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE recetas ADD COLUMN IF NOT EXISTS medicamentos JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE recetas ADD COLUMN IF NOT EXISTS receta_origen_id UUID REFERENCES recetas(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_recetas_paciente ON recetas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_recetas_medico ON recetas(medico_id);
CREATE INDEX IF NOT EXISTS idx_recetas_codigo_qr ON recetas(codigo_qr);

CREATE TABLE IF NOT EXISTS medicamentos_catalogo (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre           VARCHAR(180) NOT NULL,
  principio_activo VARCHAR(180),
  presentacion     VARCHAR(120),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_medicamentos_catalogo_nombre_lower ON medicamentos_catalogo (lower(nombre));

-- ============================================================
-- AVISOS
-- ============================================================
-- para_user_id es TEXT (no FK) porque la app usa el literal 'admin'
-- para avisos globales de administración, además de ids reales de usuario
-- de cualquiera de los 4 roles.
CREATE TABLE IF NOT EXISTS avisos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  para_user_id  TEXT NOT NULL,
  tipo          tipo_aviso NOT NULL,
  titulo        VARCHAR(150) NOT NULL,
  detalle       TEXT,
  fecha         DATE NOT NULL,
  hora          VARCHAR(20),
  leido         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_avisos_para_user ON avisos(para_user_id);
CREATE INDEX IF NOT EXISTS idx_avisos_leido ON avisos(leido);
