import { inject, Injectable } from '@angular/core';
import { Api } from './api';
import { Observable } from 'rxjs';
import { Category, CategoryCreate, CategoryUpdate, DeleteMessage } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CategoryServices {
  private api = inject(Api);

  getCategories(params?: any): Observable<Category[]> {
    return this.api.get<Category[]>('categories', params);
  }

  getCategory(id: string): Observable<Category> {
    return this.api.get<Category>(`categories/${id}`);
  }

  createCategory(category: CategoryCreate): Observable<Category> {
    return this.api.post<Category>(`categories`, category);
  }

  updateCategory(id: string, category: CategoryUpdate): Observable<Category> {
    return this.api.put<Category>(`categories/${id}`, category);
  }

  deleteCategory(id: string): Observable<DeleteMessage> {
    return this.api.delete<DeleteMessage>(`categories/${id}`);
  }
}
