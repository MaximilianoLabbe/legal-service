-- ============================================================================
-- LEGAL MANAGEMENT SYSTEM - DATABASE SETUP SCRIPTS
-- PostgreSQL 15+
-- ============================================================================
-- Este archivo contiene los scripts SQL para:
-- 1. Crear la base de datos
-- 2. Crear extensiones necesarias
-- 3. Crear tablas y relaciones
-- 4. Agregar datos de ejemplo
-- ============================================================================

-- ============================================================================
-- 1. CREAR BASE DE DATOS
-- ============================================================================
-- Ejecutar como superuser (postgres)
-- Descomentar si necesitas crear la BD manualmente

/*
CREATE DATABASE legal_management
  ENCODING 'UTF8'
  LC_COLLATE 'en_US.UTF-8'
  LC_CTYPE 'en_US.UTF-8'
  TEMPLATE template0;

-- Conectar a la BD y ejecutar el resto de scripts
*/

-- ============================================================================
-- 2. CREAR EXTENSIONES
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================================
-- 3. CREAR ENUMS
-- ============================================================================

-- Enum para roles de usuarios
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_role_enum') THEN
    CREATE TYPE users_role_enum AS ENUM ('admin', 'lawyer', 'user');
  END IF;
END $$;

-- Enum para estados de casos
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cases_estado_enum') THEN
    CREATE TYPE cases_estado_enum AS ENUM ('abierto', 'en_progreso', 'cerrado', 'pausado');
  END IF;
END $$;


-- ============================================================================
-- 4. CREAR TABLAS
-- ============================================================================

-- Tabla: users
-- Descripción: Usuarios del sistema (administradores, abogados, usuarios)
CREATE TABLE IF NOT EXISTS users (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  role users_role_enum NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  
  CONSTRAINT pk_users PRIMARY KEY (id),
  CONSTRAINT uk_users_email UNIQUE (email)
);

-- Tabla: clients
-- Descripción: Clientes asignados a usuarios
CREATE TABLE IF NOT EXISTS clients (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  rut VARCHAR(15) NOT NULL UNIQUE,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  
  CONSTRAINT pk_clients PRIMARY KEY (id),
  CONSTRAINT fk_clients_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT uk_clients_rut UNIQUE (rut),
  CONSTRAINT uk_clients_email UNIQUE (email)
);

-- Tabla: cases
-- Descripción: Casos legales asociados a clientes
CREATE TABLE IF NOT EXISTS cases (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  client_id UUID NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  estado cases_estado_enum NOT NULL DEFAULT 'abierto',
  descripcion TEXT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  
  CONSTRAINT pk_cases PRIMARY KEY (id),
  CONSTRAINT fk_cases_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_cases_client_id FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Tabla: files
-- Descripción: Archivos almacenados en cada caso
CREATE TABLE IF NOT EXISTS files (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL,
  nombre_original VARCHAR(255) NOT NULL,
  nombre_almacenado VARCHAR(255) NOT NULL UNIQUE,
  tipo_archivo VARCHAR(100) NOT NULL,
  mime_type VARCHAR(50) NOT NULL,
  tamaño BIGINT NOT NULL,
  ruta TEXT NOT NULL,
  categoría VARCHAR(100),
  descripcion TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  
  CONSTRAINT pk_files PRIMARY KEY (id),
  CONSTRAINT fk_files_case_id FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);


-- ============================================================================
-- 5. CREAR ÍNDICES PARA MEJOR PERFORMANCE
-- ============================================================================

-- Índices en tabla users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Índices en tabla clients
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_rut ON clients(rut);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_nombre ON clients(nombre);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at);

-- Índices en tabla cases
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_client_id ON cases(client_id);
CREATE INDEX IF NOT EXISTS idx_cases_estado ON cases(estado);
CREATE INDEX IF NOT EXISTS idx_cases_fecha_inicio ON cases(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at);

-- Índices en tabla files
CREATE INDEX IF NOT EXISTS idx_files_case_id ON files(case_id);
CREATE INDEX IF NOT EXISTS idx_files_tipo_archivo ON files(tipo_archivo);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at);


-- ============================================================================
-- 6. AGREGAR DATOS DE EJEMPLO (OPCIONAL)
-- ============================================================================
-- Los datos de ejemplo han sido removidos. 
-- Para agregar usuarios, usa los endpoints de la API o inserta manualmente.

-- ============================================================================
-- 7. FUNCIONES ÚTILES
-- ============================================================================

-- Función para obtener estadísticas de casos por estado
CREATE OR REPLACE FUNCTION get_case_statistics()
RETURNS TABLE (
  total_cases BIGINT,
  abierto BIGINT,
  en_progreso BIGINT,
  cerrado BIGINT,
  pausado BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT,
    COUNT(CASE WHEN estado = 'abierto' THEN 1 END)::BIGINT,
    COUNT(CASE WHEN estado = 'en_progreso' THEN 1 END)::BIGINT,
    COUNT(CASE WHEN estado = 'cerrado' THEN 1 END)::BIGINT,
    COUNT(CASE WHEN estado = 'pausado' THEN 1 END)::BIGINT
  FROM cases;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener clientes por usuario
CREATE OR REPLACE FUNCTION get_user_clients(user_id UUID)
RETURNS TABLE (
  id UUID,
  rut VARCHAR(15),
  nombre VARCHAR(255),
  telefono VARCHAR(20),
  email VARCHAR(255),
  total_cases BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.rut,
    c.nombre,
    c.telefono,
    c.email,
    COUNT(ca.id)::BIGINT
  FROM clients c
  LEFT JOIN cases ca ON c.id = ca.client_id
  WHERE c.user_id = $1
  GROUP BY c.id, c.rut, c.nombre, c.telefono, c.email;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener resumen de usuario
CREATE OR REPLACE FUNCTION get_user_summary(user_id UUID)
RETURNS TABLE (
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  total_clients BIGINT,
  total_cases BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.email,
    CONCAT(u.first_name, ' ', u.last_name),
    COUNT(DISTINCT c.id)::BIGINT,
    COUNT(DISTINCT ca.id)::BIGINT
  FROM users u
  LEFT JOIN clients c ON u.id = c.user_id
  LEFT JOIN cases ca ON c.id = ca.client_id
  WHERE u.id = $1
  GROUP BY u.id, u.email, u.first_name, u.last_name;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- 8. VISTAS ÚTILES
-- ============================================================================

-- Vista: Casos activos por usuario
CREATE OR REPLACE VIEW active_cases_by_user AS
SELECT
  u.id as user_id,
  u.email,
  u.first_name,
  u.last_name,
  c.id as client_id,
  c.nombre as client_name,
  ca.id as case_id,
  ca.tipo,
  ca.estado,
  ca.fecha_inicio,
  ca.fecha_fin
FROM users u
INNER JOIN clients c ON u.id = c.user_id
INNER JOIN cases ca ON c.id = ca.client_id
WHERE ca.estado IN ('abierto', 'en_progreso');

-- Vista: Resumen de usuarios con conteos
CREATE OR REPLACE VIEW user_summary_view AS
SELECT
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.role,
  COUNT(DISTINCT c.id)::BIGINT as client_count,
  COUNT(DISTINCT ca.id)::BIGINT as case_count,
  u.created_at,
  u.updated_at
FROM users u
LEFT JOIN clients c ON u.id = c.user_id
LEFT JOIN cases ca ON c.id = ca.client_id
GROUP BY u.id, u.email, u.first_name, u.last_name, u.role, u.created_at, u.updated_at;

-- Vista: Clientes con casos activos
CREATE OR REPLACE VIEW clients_with_active_cases AS
SELECT
  c.id,
  c.rut,
  c.nombre,
  c.email,
  COUNT(CASE WHEN ca.estado IN ('abierto', 'en_progreso') THEN 1 END)::BIGINT as active_cases,
  COUNT(CASE WHEN ca.estado = 'cerrado' THEN 1 END)::BIGINT as closed_cases,
  u.first_name as user_first_name,
  u.last_name as user_last_name,
  u.email as user_email
FROM clients c
LEFT JOIN cases ca ON c.id = ca.client_id
LEFT JOIN users u ON c.user_id = u.id
GROUP BY c.id, c.rut, c.nombre, c.email, u.first_name, u.last_name, u.email;


-- ============================================================================
-- 9. POLÍTICAS DE SEGURIDAD (Comentadas - activar si usas Row Level Security)
-- ============================================================================

/*
-- Habilitar RLS en tabla clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios solo pueden ver sus propios clientes
CREATE POLICY clients_user_isolation ON clients
  FOR SELECT
  USING (user_id = current_user_id());

-- Política: Usuarios solo pueden insertar clientes para ellos mismos
CREATE POLICY clients_insert_own ON clients
  FOR INSERT
  WITH CHECK (user_id = current_user_id());
*/


-- ============================================================================
-- 10. QUERIES ÚTILES PARA TESTING Y ANÁLISIS
-- ============================================================================

-- Obtener todos los usuarios con sus estadísticas
-- SELECT * FROM user_summary_view ORDER BY created_at DESC;

-- Obtener casos activos por usuario
-- SELECT * FROM active_cases_by_user ORDER BY user_email, client_name;

-- Obtener clientes con sus casos activos
-- SELECT * FROM clients_with_active_cases ORDER BY nombre;

-- Obtener estadísticas generales de casos
-- SELECT * FROM get_case_statistics();

-- Obtener clientes de un usuario específico
-- SELECT * FROM get_user_clients('USER_ID_HERE');

-- Obtener resumen de un usuario
-- SELECT * FROM get_user_summary('USER_ID_HERE');


-- ============================================================================
-- FIN DE LOS SCRIPTS
-- ============================================================================
-- Fecha de creación: 2026-05-02
-- Versión: 1.0
-- Última actualización: TypeORM + PostgreSQL 15
-- ============================================================================
