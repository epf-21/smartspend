import { computed, inject, Injectable, signal } from '@angular/core';
import { Api } from './api';
import { Router } from '@angular/router';
import { LoginRequest, RegisterRequest, Token, User } from '../models';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private api = inject(Api);
  private router = inject(Router);
  private tokenSignal = signal<string | null>(null);
  private userSignal = signal<User | null>(null);

  token = computed(() => this.tokenSignal());
  user = computed(() => this.userSignal());
  isAuthenticated = computed(() => !!this.tokenSignal() && !!this.userSignal());

  constructor() {
    this.loadStoredAuth();
  }

  register(data: RegisterRequest): Observable<Token> {
    return this.api.post<Token>('register', data).pipe(
      tap((response) => {
        this.setToken(response.access_token);
        this.loadCurrentUser();
      }),
    );
  }

  login(credentials: LoginRequest): Observable<Token> {
    return this.api.post<Token>('login', credentials).pipe(
      tap((response) => {
        this.setToken(response.access_token);
        this.loadCurrentUser();
      }),
    );
  }

  loadCurrentUser() {
    if (!this.tokenSignal()) return;
    this.api.get<User>('me').subscribe({
      next: (user) => {
        this.setUser(user);
      },
      error: (error) => {
        console.error('Error laoding user: ', error);
        this.logout();
      },
    });
  }

  refreshToken(): Observable<Token> {
    return this.api.post<Token>('auth/refresh', {}).pipe(
      tap((response) => {
        this.setToken(response.access_token);
      }),
    );
  }

  logout() {
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setToken(token: string) {
    this.tokenSignal.set(token);
    localStorage.setItem('auth_token', token);
  }

  private setUser(user: User) {
    this.userSignal.set(user);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  private clearAuthData() {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  private loadStoredAuth() {
    const token = this.getStoredToken();
    const user = this.getStoredUser();

    if (token && user) {
      this.tokenSignal.set(token);
      this.userSignal.set(user);
    }
  }

  private getStoredToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_toekn');
  }

  private getStoredUser() {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('auth_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  hasValidSession() {
    return this.isAuthenticated();
  }
}
