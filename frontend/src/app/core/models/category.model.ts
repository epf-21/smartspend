import { BaseEntity } from './base-entity.model';

export interface UserOwnedEntity {
  user_id: string | null;
}

export interface CategoryData {
  name: string;
  color: string;
  icon: string;
}

export interface Category extends CategoryData, BaseEntity, UserOwnedEntity {}

export type CategoryCreate = CategoryData;

export type CategoryUpdate = Partial<CategoryData>;

export type CategoryResponse = Category;
