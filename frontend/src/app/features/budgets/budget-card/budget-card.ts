import { Component, computed, input, output } from '@angular/core';
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

  private spentAmount = computed(() => {
    const budget = this.budget();
    return Math.random() * budget.amount * 1.2;
  });

  onEdit() {
    this.editClick.emit(this.budget());
  }

  onDelete() {
    this.deleteClick.emit(this.budget());
  }

  getPeriodLabel(): string {
    const period = this.budget().period;
    const labels = {
      [BudgetPeriod.WEEKLY]: 'Semanal',
      [BudgetPeriod.MONTHLY]: 'Mensual',
      [BudgetPeriod.QUARTERLY]: 'Trimestral',
      [BudgetPeriod.YEARLY]: 'Anual',
    };
    return labels[period] || 'Desconocido';
  }

  getStatusBadgeClass(): string {
    return this.budget().is_active
      ? 'bg-emerald-100 text-emerald-800'
      : 'bg-gray-100 text-gray-800';
  }

  getSpentAmount(): number {
    return this.spentAmount();
  }

  getRemainingAmount(): number {
    return Math.max(0, this.budget().amount - this.getSpentAmount());
  }

  getProgressPercentage(): number {
    const percentage = (this.getSpentAmount() / this.budget().amount) * 100;
    return Math.round(Math.min(100, percentage));
  }

  getProgressBarClass(): string {
    const percentage = this.getProgressPercentage();
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 90) return 'bg-yellow-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-emerald-500';
  }

  formatDate(dateString: string | null): string {
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
}
