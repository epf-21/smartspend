import { PaymentMethod } from '../enums';
import { BaseEntity } from './base-entity.model';

export interface TransactionData {
  amount: Number;
  description: string;
  date: string;
  payment_method: PaymentMethod;
}

export interface Transaction extends TransactionData, BaseEntity {
  category_id: string;
}

export interface TransactoinCreate extends TransactionData {
  category_id: string;
}

export interface TransactionUpdate extends Partial<TransactionData> {
  category_id?: string;
}

export type TransactionResponse = Transaction;
