import { Component } from '@angular/core';
import { LucideAngularModule, PiggyBank } from 'lucide-angular';

@Component({
  selector: 'app-home-footer',
  imports: [LucideAngularModule],
  template: `
    <footer class="bg-gray-900 text-gray-400 py-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center gap-2 text-white font-bold text-xl mb-4 md:mb-0">
            <i-lucide [img]="PiggyBank" class="w-6 h-6"></i-lucide>
            SmartSpend
          </div>
          <p class="text-sm">© 2024 SmartSpend. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `,
  styles: ``,
})
export class HomeFooter {
  readonly PiggyBank = PiggyBank;
}
