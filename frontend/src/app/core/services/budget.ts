import { inject, Injectable } from '@angular/core';
import { Api } from './api';
import { Observable } from 'rxjs';
import { Budget, BudgetCreate, BudgetUpdate, DeleteMessage } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private api = inject(Api);

  getBudgets(params?: any): Observable<Budget[]> {
    return this.api.get<Budget[]>('budgets', params);
  }

  getBudget(id: string): Observable<Budget> {
    return this.api.get<Budget>(`budgets/${id}`);
  }

  createBudget(budget: BudgetCreate): Observable<Budget> {
    return this.api.post<Budget>('budgets', budget);
  }

  updateBudget(id: string, budget: BudgetUpdate): Observable<Budget> {
    return this.api.put(`budgets/${id}`, budget);
  }

  deleteBudget(id: string): Observable<DeleteMessage> {
    return this.api.delete<DeleteMessage>(`budgets/${id}`);
  }

  getBudgetsByCategory(id: string): Observable<Budget[]> {
    return this.api.get<Budget[]>(`budgets/category/${id}`);
  }
}
