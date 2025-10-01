import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { TransactionsComponent } from './features/transactions/transactions';
import { CategoriesComponent } from './features/categories/categories';
import { BudgetsComponent } from './features/budgets/budgets';
import { Reports } from './features/reports/reports';
import { NotFound } from './shared/components/not-found/not-found';
import { Home } from './features/home/home';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: '',
    component: MainLayout,
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
