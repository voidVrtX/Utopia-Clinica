-- Esquema PostgreSQL para Utopía Clínica
-- Basado en src/models/{User,Cita,Receta,Aviso}.ts de la app móvil

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
-- USERS (paciente, medico, admin, farmacia en una sola tabla)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
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
  seguro_medico       VARCHAR(100),
  avatar_color        VARCHAR(20),

  -- Paciente
  contacto_emergencia JSONB,

  -- Medico
  especialidad        VARCHAR(100),
  institucion         VARCHAR(150),
  anios_experiencia   VARCHAR(50),
  sobre_el_medico     TEXT,
  areas_especialidad  TEXT[],
  ubicacion_atencion  TEXT,
  activo              BOOLEAN NOT NULL DEFAULT TRUE,
  valoracion          NUMERIC(2,1),
  num_opiniones       INTEGER DEFAULT 0,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_especialidad ON users(especialidad) WHERE role = 'medico';

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- CITAS
-- ============================================================
CREATE TABLE IF NOT EXISTS citas (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medico_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
  paciente_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medico_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cita_id           UUID REFERENCES citas(id) ON DELETE SET NULL,
  fecha             DATE NOT NULL,
  diagnostico       TEXT,
  tratamiento       TEXT,
  observaciones     TEXT,
  presion_arterial  VARCHAR(30),
  temperatura       VARCHAR(20),
  valida            BOOLEAN NOT NULL DEFAULT TRUE,
  invalidada_en     TIMESTAMPTZ,
  invalidada_por    UUID REFERENCES users(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recetas_paciente ON recetas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_recetas_medico ON recetas(medico_id);
CREATE INDEX IF NOT EXISTS idx_recetas_codigo_qr ON recetas(codigo_qr);

-- ============================================================
-- AVISOS
-- ============================================================
-- para_user_id es TEXT (no FK) porque la app usa el literal 'admin'
-- para avisos globales de administración, además de ids reales de usuario.
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
