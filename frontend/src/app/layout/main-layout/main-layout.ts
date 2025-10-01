import { Component, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Sidebar],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header (toggleSidebar)="toggleSidebar()"></app-header>

      <app-sidebar
        [isOpen]="sidebarOpen()"
        (closeSidebar)="closeSidebar()"
        (menuItemSelected)="onMenuItemSelected($event)"
      ></app-sidebar>

      <div
        class="transition-all duration-300 ease-in-out min-h-screen"
        [class]="getMainContentClasses()"
      >
        <main>
          <router-outlet></router-outlet>
        </main>
      </div>
      @if (sidebarOpen() && isMobile()) {
        <div
          (click)="closeSidebar()"
          class="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
        ></div>
      }
    </div>
  `,
})
export class MainLayout {
  sidebarOpen = signal(true);
  isMobile = signal(false);

  constructor() {
    this.checkIfMobile();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkIfMobile();
  }

  private checkIfMobile() {
    const wasMobile = this.isMobile();
    const isCurrentlyMobile = window.innerWidth < 1024;
    this.isMobile.set(isCurrentlyMobile);

    if (wasMobile !== isCurrentlyMobile) {
      if (isCurrentlyMobile) {
        this.sidebarOpen.set(false);
      } else {
        this.sidebarOpen.set(true);
      }
    }
  }

  toggleSidebar() {
    this.sidebarOpen.update((current) => !current);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  onMenuItemSelected(itemId: string) {
    if (this.isMobile()) {
      this.closeSidebar();
    }
  }

  getMainContentClasses() {
    const isMobileDevice = this.isMobile();
    const sidebarIsOpen = this.sidebarOpen();

    if (isMobileDevice) {
      return 'ml-0';
    } else {
      return sidebarIsOpen ? 'ml-72' : 'ml-0';
    }
  }
}
