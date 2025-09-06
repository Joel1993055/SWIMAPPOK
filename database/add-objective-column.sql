-- Agregar columna objective a la tabla sessions
ALTER TABLE sessions ADD COLUMN objective TEXT DEFAULT 'otro';

-- Actualizar registros existentes con valor por defecto
UPDATE sessions SET objective = 'otro' WHERE objective IS NULL;
