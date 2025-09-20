import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  LucideIconData,
  FolderCog,
  X,
  Cog,
  LayoutDashboard,
  BadgeDollarSign,
  ChartBarStacked,
  Wallet,
  FileChartColumn,
} from 'lucide-angular';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIconData;
  route: string;
  isActive: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule, RouterLink],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  readonly Cog = Cog;
  readonly FolderCog = FolderCog;
  readonly X = X;

  isOpen = input<boolean>(false);
  closeSidebar = output<void>();
  menuItemSelected = output<string>();

  menuItems: MenuItem[] = [
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
      isActive: false,
    },
    {
      id: 'categories',
      label: 'Categorías',
      icon: ChartBarStacked,
      route: '/categories',
      isActive: false,
    },
    {
      id: 'budgets',
      label: 'Presupuestos',
      icon: Wallet,
      route: '/budgets',
      isActive: false,
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: FileChartColumn,
      route: '/reports',
      isActive: false,
    },
  ];

  onMenuItemClick(item: MenuItem) {
    this.menuItems.forEach((menuItem) => (menuItem.isActive = false));
    item.isActive = true;

    this.menuItemSelected.emit(item.id);
  }

  getMenuItemsClass(item: MenuItem) {
    const baseClass = 'text-white/80 hover:text-white hover:bg-white/10';
    const activeClass = 'text-white bg-white/20 shadow-lg transform translate-x-2';

    return item.isActive ? activeClass : baseClass;
  }
}
