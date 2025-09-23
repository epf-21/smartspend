import { inject, Injectable } from '@angular/core';
import { Api } from './api';
import { Transaction, TransactionCreate, TransactionSummary } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionServices {
  private api = inject(Api);

  getTransactions(params?: any): Observable<Transaction[]> {
    return this.api.get<Transaction[]>('transactions', params);
  }

  getTransaction(id: string): Observable<Transaction> {
    return this.api.get<Transaction>(`transactions/${id}`);
  }

  createTransaction(transaction: TransactionCreate): Observable<Transaction> {
    return this.api.post<Transaction>('transactions', transaction);
  }

  getTransactionsByUser(id: string): Observable<Transaction> {
    return this.api.get<Transaction>(`user/${id}`);
  }

  getTransactionsSummary(id: string): Observable<TransactionSummary> {
    return this.api.get<TransactionSummary>(`user/${id}/summary`);
  }

  getTransactionsSummaryWithCategory(id: string): Observable<TransactionSummary> {
    return this.api.get<TransactionSummary>(`category/${id}/summary`);
  }

  getTransactionsByCategory(categoryId: string): Observable<Transaction[]> {
    return this.api.get<Transaction[]>(`transactions/category/${categoryId}`);
  }
}
