import { Component } from '@angular/core';
import {
  LucideAngularModule,
  FolderCog,
  X,
  Cog,
  LayoutDashboard,
  BadgeDollarSign,
  ChartBarStacked,
  Wallet,
  FileChartColumn,
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly Cog = Cog;
  readonly FolderCog = FolderCog;
  readonly X = X;
  menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      route: '/dashboard',
      isActive: true,
    },
    {
      id: 'transactions',
      label: 'Transacciones',
      icon: BadgeDollarSign,
      route: '/transactions',
      isActive: true,
    },
    {
      id: 'categories',
      label: 'Categorías',
      icon: ChartBarStacked,
      route: '/categories',
      isActive: true,
    },
    {
      id: 'budgets',
      label: 'Presupuestos',
      icon: Wallet,
      route: '/budgets',
      isActive: true,
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: FileChartColumn,
      route: '/reports',
      isActive: true,
    },
  ];
}
