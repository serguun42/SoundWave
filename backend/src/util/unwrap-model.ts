import { ModelFromDB } from '../types/db.js';

export function UnwrapOne<T extends object>(model: ModelFromDB<T> | null | undefined): T | null {
  if (!model) return null;
  if ('dataValues' in model) return model?.dataValues;
  return model as T;
}

export function UnwrapMany<T extends object>(models: ModelFromDB<T>[] | undefined): T[] {
  if (!models) return [];

  return models.map((model) => UnwrapOne(model)) as T[];
}
