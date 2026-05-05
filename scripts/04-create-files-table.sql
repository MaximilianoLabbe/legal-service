-- Crear tabla de archivos
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  nombre_original VARCHAR(255) NOT NULL,
  nombre_almacenado VARCHAR(255) NOT NULL UNIQUE,
  tipo_archivo VARCHAR(100) NOT NULL,
  mime_type VARCHAR(50) NOT NULL,
  tamaño BIGINT NOT NULL,
  ruta TEXT NOT NULL,
  categoría VARCHAR(100),
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_files_case FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_files_case_id ON files(case_id);
CREATE INDEX idx_files_tipo_archivo ON files(tipo_archivo);
CREATE INDEX idx_files_created_at ON files(created_at DESC);
