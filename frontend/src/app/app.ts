import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Sidebar } from './shared/components/sidebar/sidebar';

@Component({
  selector: 'app-root',
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
        class="transition-all duration-300 ease-in-out"
        [class.ml-72]="!isMobile() && sidebarOpen()"
        [class.ml-0]="isMobile() && sidebarOpen()"
      >
        <main class="min-h-screen">
          <router-outlet></router-outlet>
        </main>
      </div>
      @if (sidebarOpen() && isMobile()) {
        <div (click)="closeSidebar()" class="fixed inset-0 bg-back opacity-50 z-30 lg:hidden"></div>
      }
    </div>
  `,
})
export class App {
  title = 'SmartSpend';
  sidebarOpen = signal(false);
  isMobile = signal(false);

  constructor() {
    this.chechIfMobile();
  }

  @HostListener('window:resize')
  onResize() {
    this.chechIfMobile();
  }

  private chechIfMobile() {
    this.isMobile.set(window.innerWidth < 1024);

    if (this.isMobile()) {
      this.sidebarOpen.set(false);
    } else {
      this.sidebarOpen.set(true);
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
}
