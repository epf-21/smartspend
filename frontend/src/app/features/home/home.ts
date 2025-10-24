import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  ArrowRight,
  ChartBar,
  Check,
  LucideAngularModule,
  PiggyBank,
  Shield,
  TrendingUp,
} from 'lucide-angular';
import { HomeHeader } from './home-header/home-header';
import { HomeSection } from './home-section/home-section';
import { HomeFooter } from './home-footer/home-footer';

@Component({
  selector: 'app-home',
  imports: [LucideAngularModule, HomeHeader, HomeSection, HomeFooter],
  template: `
    <app-home-header (onGetStarted)="goToDashboard()"></app-home-header>
    <app-home-section (onGetStarted)="goToDashboard()"></app-home-section>
    <app-home-footer></app-home-footer>
  `,
})
export class Home {
  readonly PiggyBank = PiggyBank;
  readonly TrendingUp = TrendingUp;
  readonly Shield = Shield;
  readonly BarChart3 = ChartBar;
  readonly Check = Check;
  readonly ArrowRight = ArrowRight;

  private router = inject(Router);

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
