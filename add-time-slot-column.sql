-- Agregar columna time_slot a la tabla sessions
ALTER TABLE sessions 
ADD COLUMN time_slot VARCHAR(2) DEFAULT 'AM' CHECK (time_slot IN ('AM', 'PM'));

-- Actualizar registros existentes para que tengan un valor por defecto
UPDATE sessions 
SET time_slot = 'AM' 
WHERE time_slot IS NULL;
