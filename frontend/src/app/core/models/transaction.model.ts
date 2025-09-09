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

export type TransactionResponse = Transaction;

export interface TransactionSummary {
  total_expenses: number;
}
