import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-home-card',
  imports: [LucideAngularModule, NgClass],
  template: `
    <div class="flex items-center gap-3 p-4 bg-gradient-to-r rounded-xl" [ngClass]="gradientClass()">
      <div class="w-12 h-12 rounded-xl flex items-center justify-center" [ngClass]="iconBgCLass()">
        <i-lucide [img]="icon()" class="w-6 h-6 text-white"></i-lucide>
      </div>
      <div>
        <p class="text-sm text-gray-600">{{ label() }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ value() }}</p>
      </div>
    </div>
  `,
  styles: ``,
})
export class HomeCard {
  label = input.required<string>();
  value = input.required<string>();
  icon = input.required<LucideIconData>();
  gradientClass = input<string>('from-emerald-50 to-emerald-100');
  iconBgCLass = input<string>('bg-emerald-500');
}
