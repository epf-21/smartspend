import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { ArrowUpDown, Banknote, CreditCard, LucideAngularModule } from 'lucide-angular';
import { CategoryServices } from '../../../core/services/category';
import { Category, Transaction } from '../../../core/models';
import { toSignal } from '@angular/core/rxjs-interop';
import { PaymentMethod } from '../../../core/enums';

@Component({
  selector: 'app-transaction-list',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './transaction-list.html',
  styles: ``,
})
export class TransactionList {
  readonly CreditCard = CreditCard;
  readonly Banknote = Banknote;
  readonly ArrowUpDown = ArrowUpDown;

  private categoryService = inject(CategoryServices);

  transactions = input.required<Transaction[]>();

  editTransaction = output<Transaction>();

  categories = toSignal(this.categoryService.getCategories(), { initialValue: [] as Category[] });

  getTotalAmount = computed(() => {
    return this.transactions().reduce((total, transaction) => total + transaction.amount, 0);
  });

  getCategoryById(categoryId: string) {
    return this.categories().find((cat) => cat.id === categoryId);
  }
  getPaymentMethodIcon(method: PaymentMethod) {
    const icons = {
      [PaymentMethod.CASH]: Banknote,
      [PaymentMethod.CREDIT_CARD]: CreditCard,
      [PaymentMethod.DEBIT_CARD]: CreditCard,
      [PaymentMethod.TRANSFER]: ArrowUpDown,
      [PaymentMethod.OTHER]: CreditCard,
    };
    return icons[method] || CreditCard;
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    const labels = {
      [PaymentMethod.CASH]: 'Efectivo',
      [PaymentMethod.CREDIT_CARD]: 'T. Crédito',
      [PaymentMethod.DEBIT_CARD]: 'T. Débito',
      [PaymentMethod.TRANSFER]: 'Transferencia',
      [PaymentMethod.OTHER]: 'Otro',
    };
    return labels[method] || 'Desconocido';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
