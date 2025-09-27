import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import {
  Calendar,
  DollarSign,
  LucideAngularModule,
  Pencil,
  Trash,
  TrendingUp,
  TriangleAlert,
} from 'lucide-angular';
import { Budget } from '../../../core/models';
import { BudgetPeriod } from '../../../core/enums';
import { CommonModule } from '@angular/common';
import { TransactionServices } from '../../../core/services/transaction';

@Component({
  selector: 'app-budget-card',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './budget-card.html',
})
export class BudgetCard {
  readonly Pencil = Pencil;
  readonly Trash = Trash;
  readonly Calendar = Calendar;
  readonly DollarSign = DollarSign;
  readonly TrendingUp = TrendingUp;
  readonly TriangleAlert = TriangleAlert;

  budget = input.required<Budget>();

  editClick = output<Budget>();
  deleteClick = output<Budget>();

  private transactionService = inject(TransactionServices);

  spentAmount = signal<number>(0);
  isLoadingExpenses = signal<boolean>(true);
  hasErrorLoadingExpenses = signal<boolean>(false);

  constructor() {
    effect(() => {
      const currentBudget = this.budget();
      if (currentBudget?.category_id) {
        this.loadCategoryExpenses(currentBudget.category_id);
      }
    });
  }

  private loadCategoryExpenses(categoryId: string) {
    this.isLoadingExpenses.set(true);
    this.hasErrorLoadingExpenses.set(false);

    this.transactionService.getTransactionsSummaryWithCategory(categoryId).subscribe({
      next: (summary) => {
        this.spentAmount.set(summary.total_expenses || 0);
        this.isLoadingExpenses.set(false);
      },
      error: (error) => {
        console.error('Error loading category expenses: ', error);
        this.spentAmount.set(0);
        this.hasErrorLoadingExpenses.set(true);
        this.isLoadingExpenses.set(false);
      },
    });
  }
  onEdit() {
    this.editClick.emit(this.budget());
  }

  onDelete() {
    this.deleteClick.emit(this.budget());
  }

  getPeriodLabel() {
    const period = this.budget().period;
    const labels = {
      [BudgetPeriod.WEEKLY]: 'Semanal',
      [BudgetPeriod.MONTHLY]: 'Mensual',
      [BudgetPeriod.QUARTERLY]: 'Trimestral',
      [BudgetPeriod.YEARLY]: 'Anual',
    };
    return labels[period] || 'Desconocido';
  }

  getStatusBadgeClass() {
    return this.budget().is_active
      ? 'bg-emerald-100 text-emerald-800'
      : 'bg-gray-100 text-gray-800';
  }

  getSpentAmount() {
    return this.spentAmount();
  }

  getRemainingAmount() {
    return Math.max(0, this.budget().amount - this.getSpentAmount());
  }

  getProgressPercentage() {
    const spent = this.getSpentAmount();
    const budgetAmount = this.budget().amount;

    if (budgetAmount === 0) return 0;

    const percentage = (spent / budgetAmount) * 100;
    return Math.round(Math.min(percentage, 999));
  }

  getProgressBarClass() {
    const percentage = this.getProgressPercentage();
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 90) return 'bg-yellow-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-emerald-500';
  }

  getProgressBarWidth() {
    return Math.min(this.getProgressPercentage(), 100);
  }

  formatDate(dateString: string | null) {
    if (dateString) {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } else {
      return 'Indefinido';
    }
  }

  getExpenseDisplayText() {
    if (this.isLoadingExpenses()) {
      return 'Cargando...';
    }
    if (this.hasErrorLoadingExpenses()) {
      return 'Error al cargar';
    }
    return `$${this.getSpentAmount().toFixed(2)}`;
  }

  showBudgetWarning() {
    return this.getProgressPercentage() > 90 && !this.isLoadingExpenses();
  }

  getBudgetWarningMessage() {
    const percentage = this.getProgressPercentage();
    if (percentage >= 100) {
      return `Presupuesto excedido en $${(this.getSpentAmount() - this.budget().amount).toFixed(2)}`;
    }
    return 'Cerca del límite del presupuesto';
  }
}
