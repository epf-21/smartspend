import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Activity, ArrowRight, LucideAngularModule, PiggyBank, TrendingUp } from 'lucide-angular';

@Component({
  selector: 'app-home',
  imports: [LucideAngularModule],
  templateUrl: './home.html',
})
export class Home {
  readonly PiggyBank = PiggyBank;
  readonly TrendingUp = TrendingUp;
  readonly Activity = Activity;
  readonly ArrowRight = ArrowRight;

  private router = inject(Router);

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
