import { Component, output } from '@angular/core';
import { LucideAngularModule, PiggyBank, Plus } from 'lucide-angular';

@Component({
  selector: 'app-budget-header',
  imports: [LucideAngularModule],
  templateUrl: './budget-header.html',
})
export class BudgetHeader {
  readonly Plus = Plus;
  readonly PiggyBank = PiggyBank;

  newBudgetClick = output<void>();

  onNewBudget() {
    this.newBudgetClick.emit();
  }
}
