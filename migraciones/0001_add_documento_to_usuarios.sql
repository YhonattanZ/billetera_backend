-- =========== CAMBIO EN RUTA UP (Actualizar) ===========
-- 1. Agregar la columna 'documento_identidad' permitiendo nulos temporalmente
ALTER TABLE usuarios ADD COLUMN documento_identidad VARCHAR(20) NULL;

-- 2. Crear un índice único para que no se repitan documentos de identidad
CREATE UNIQUE INDEX idx_usuarios_documento ON usuarios(documento_identidad);


-- =========== CAMBIO EN RUTA DOWN (Revertir / deshacer) ===========
-- En caso de que el despliegue falle, este comando devuelve la BD a como estaba antes:
-- ALTER TABLE usuarios DROP INDEX idx_usuarios_documento;
-- ALTER TABLE usuarios DROP COLUMN documento_identidad;