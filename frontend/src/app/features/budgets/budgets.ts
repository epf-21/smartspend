import { Component, inject, signal } from '@angular/core';
import {
  ChartNoAxesCombined,
  DollarSign,
  LucideAngularModule,
  PiggyBank,
  TriangleAlert,
} from 'lucide-angular';
import { BudgetHeader } from './budget-header/budget-header';
import { BudgetGrid } from './budget-grid/budget-grid';
import { BudgetService } from '../../core/services/budget';
import { Budget } from '../../core/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budgets',
  imports: [CommonModule, LucideAngularModule, BudgetHeader, BudgetGrid],
  templateUrl: './budgets.html',
  styles: ``,
})
export class BudgetsComponent {
  readonly PiggyBank = PiggyBank;
  readonly DollarSing = DollarSign;
  readonly TriangleAlert = TriangleAlert;
  readonly ChartNoAxesCombined = ChartNoAxesCombined;

  private budgetService = inject(BudgetService);

  isModalOpen = signal<boolean>(false);
  selectedBudget = signal<Budget | null>(null);
  budgets = signal<Budget[]>([]);

  constructor() {
    this.loadBudgets();
  }

  private loadBudgets() {
    this.budgetService.getBudgets().subscribe({
      next: (budgets) => {
        this.budgets.set(budgets);
      },
      error: (error) => {
        console.error('Error loading budgets: ', error);
      },
    });
  }

  getTotalBudgeted() {
    return this.budgets().reduce((total, budget) => total + budget.amount, 0);
  }

  getActiveBudgetsCount() {
    return this.budgets().filter((budget) => budget.is_active).length;
  }

  getBudgetsNearLimit() {
    return Math.floor(this.budgets().length * 0.3);
  }

  openCreateModal() {
    this.selectedBudget.set(null);
    this.isModalOpen.set(false);
  }

  openEditModal(budget: Budget) {
    this.selectedBudget.set(budget);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedBudget.set(null);
  }

  onBudgetSaved(savedBudget: Budget) {
    if (this.selectedBudget()) {
      this.budgets.update((budgets) =>
        budgets.map((budget) => (budget.id === savedBudget.id ? savedBudget : budget)),
      );
    } else {
      this.budgets.update((budgets) => [...budgets, savedBudget]);
    }
  }

  deleteBudget(budget: Budget) {
    if (confirm(`¿Estás seguro de que quieres eliminar el presupuesto de "${budget.amount}"?`)) {
      this.budgetService.deleteBudget(budget.id).subscribe({
        next: () => {
          this.budgets.update((budgets) => budgets.filter((b) => b.id !== budget.id));
        },
        error: (error) => {
          console.error('Error deleting budget: ', error);
        },
      });
    }
  }
}
