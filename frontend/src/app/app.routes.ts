import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { TransactionsComponent } from './features/transactions/transactions';
import { CategoriesComponent } from './features/categories/categories';
import { BudgetsComponent } from './features/budgets/budgets';
import { Reports } from './features/reports/reports';
import { NotFound } from './shared/components/not-found/not-found';
import { Home } from './features/home/home';
import { MainLayout } from './layout/main-layout/main-layout';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { authGuard } from './core/guard/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'budgets', component: BudgetsComponent },
      { path: 'reports', component: Reports },
    ],
  },
  { path: '**', component: NotFound },
];
