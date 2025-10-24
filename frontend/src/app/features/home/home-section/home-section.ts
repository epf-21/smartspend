import { Component, output } from '@angular/core';
import { HomeCard } from '../home-card/home-card';
import { ArrowRight, ChartBar, LucideAngularModule, TrendingUp } from 'lucide-angular';

@Component({
  selector: 'app-home-section',
  imports: [LucideAngularModule, HomeCard],
  templateUrl: './home-section.html',
  styles: ``,
})
export class HomeSection {
  readonly ArrowRight = ArrowRight;
  readonly ChartBar = ChartBar;
  readonly TrendingUp = TrendingUp;
  onGetStarted = output<void>();

  getStarted() {
    this.onGetStarted.emit();
  }
}
