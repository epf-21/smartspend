import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
}

@Component({
  selector: 'app-sidebar',
  imports: [LucideAngularModule, RouterLink, RouterLinkActive],
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
    },
    {
      id: 'transactions',
      label: 'Transacciones',
      icon: BadgeDollarSign,
      route: '/transactions',
    },
    {
      id: 'categories',
      label: 'Categorías',
      icon: ChartBarStacked,
      route: '/categories',
    },
    {
      id: 'budgets',
      label: 'Presupuestos',
      icon: Wallet,
      route: '/budgets',
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: FileChartColumn,
      route: '/reports',
    },
  ];

  onMenuItemClick(item: MenuItem) {
    this.menuItemSelected.emit(item.id);
  }

  onCloseSidebar() {
    this.closeSidebar.emit();
  }

  getSidebarClasses() {
    const isVisible = this.isOpen();
    if (isVisible) {
      return 'translate-x-0';
    } else {
      return '-translate-x-full';
    }
  }
}
