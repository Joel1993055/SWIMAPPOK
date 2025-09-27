/**
 * Interfaz base para todas las entidades del sistema
 * Define las propiedades comunes que todas las entidades deben tener
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

/**
 * Tipo para crear una nueva entidad (sin las propiedades auto-generadas)
 */
export type CreateEntity<T extends BaseEntity> = Omit<T, keyof BaseEntity>;

/**
 * Tipo para actualizar una entidad (sin las propiedades auto-generadas)
 */
export type UpdateEntity<T extends BaseEntity> = Partial<
  Omit<T, keyof BaseEntity>
> & {
  id: string;
};
