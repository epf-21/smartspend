import { PaymentMethod } from '../enums';
import { BaseEntity } from './base-entity.model';

export interface TransactionData {
  amount: number;
  description: string;
  date: string;
  payment_method: PaymentMethod;
}

export interface Transaction extends TransactionData, BaseEntity {
  category_id: string;
}

export interface TransactionCreate extends TransactionData {
  category_id: string;
}

export interface TransactionUpdate extends Partial<TransactionData> {
  category_id?: string;
}

export interface TransactionSummary {
  total_expenses: number;
}

export interface TransactionFilters {
  search: string;
  category_id: string;
  payment_method: string;
  date_from: string;
  date_to: string;
}
