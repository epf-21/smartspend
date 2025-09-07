import { BudgetPeriod } from '../enums';
import { BaseEntity } from './base-entity.model';

export interface BudgetData {
  amount: number;
  period: BudgetPeriod;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
}

export interface Budget extends BudgetData, BaseEntity {
  category_id: string;
}

export interface BudgetCreate extends BudgetData {
  category_id: string;
}

export interface BudgetUpdate extends Partial<BudgetData> {
  category_id?: string;
}

export type BudgetResponse = Budget;
