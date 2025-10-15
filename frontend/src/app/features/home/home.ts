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

@Component({
  selector: 'app-home',
  imports: [LucideAngularModule],
  templateUrl: './home.html',
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
