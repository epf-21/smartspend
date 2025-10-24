import { Component, output } from '@angular/core';
import { LucideAngularModule, PiggyBank } from 'lucide-angular';

@Component({
  selector: 'app-home-header',
  imports: [LucideAngularModule],
  template: `
    <nav
      class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200"
    >
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-indigo-600 font-bold text-2xl">
            <i-lucide [img]="PiggyBank" class="w-8 h-8"></i-lucide>
            SmartSpend
          </div>
          <div class="flex items-center gap-4">
            <button
              (click)="getStarted()"
              class="px-6 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
            >
              Iniciar Sesión
            </button>
            <button
              (click)="getStarted()"
              class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Empezar Gratis
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: ``,
})
export class HomeHeader {
  readonly PiggyBank = PiggyBank;

  onGetStarted = output<void>();

  getStarted() {
    this.onGetStarted.emit();
  }
}
