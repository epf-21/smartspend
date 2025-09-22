import { Component, input, output } from '@angular/core';
import { LucideAngularModule, Search } from 'lucide-angular';
import { Budget } from '../../../core/models';
import { BudgetCard } from '../budget-card/budget-card';

@Component({
  selector: 'app-budget-grid',
  imports: [LucideAngularModule, BudgetCard],
  templateUrl: './budget-grid.html',
})
export class BudgetGrid {
  readonly Search = Search;

  budgets = input.required<Budget[]>();
  editBudget = output<Budget>();
  deleteBudget = output<Budget>();

  onEditBudget(budget: Budget) {
    this.editBudget.emit(budget);
  }

  onDeleteBudget(budget: Budget) {
    this.deleteBudget.emit(budget);
  }
}
