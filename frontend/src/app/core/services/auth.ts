import { computed, effect, inject, Injectable, signal } from '@angular/core';
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

  private currentUser = signal<User | null>(null);
  private token = signal<string | null>(null);

  user = this.currentUser.asReadonly();
  isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    this.loadAuthState();

    effect(() => {
      const user = this.currentUser();
      const token = this.token();

      if (user && token) {
        localStorage.setItem('auth_user', JSON.stringify(user));
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
      }
    });
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
    if (!this.token()) return;
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
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return this.token();
  }

  private setToken(token: string) {
    this.token.set(token);
    localStorage.setItem('auth_token', token);
  }

  private setUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  private loadAuthState() {
    try {
      const storedUser = localStorage.getItem('auth_user');
      const storedToken = localStorage.getItem('auth_token');

      if (storedToken && storedUser) {
        this.currentUser.set(JSON.parse(storedUser));
        this.token.set(storedToken);
      }
    } catch {}
  }

  hasValidSession() {
    return this.isAuthenticated();
  }
}
