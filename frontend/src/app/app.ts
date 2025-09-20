import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from './core/models';
import { Header } from './shared/components/header/header';
import { Sidebar } from './shared/components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header (toggleSidebar)="toggleSidebar()"></app-header>

      <app-sidebar></app-sidebar>

      <div
        class="transition-all duration-300 ease-in-out"
        [class.ml-72]="!isMobile"
        [class.ml-0]="isMobile"
      >
        <main class="min-h-screen">
          <router-outlet></router-outlet>
        </main>
      </div>
      @if (sidebarOpen) {
        <div (click)="closeSidebar()" class="fixed inset-0 bg-black opacity-50 z-30 lg:hidden">
          HOLA
        </div>
      }
    </div>
  `,
})
export class App {
  title = 'SmartSpend';
  sidebarOpen = false;
  isMobile = false;
  currentUser: User | null = null;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }
}
