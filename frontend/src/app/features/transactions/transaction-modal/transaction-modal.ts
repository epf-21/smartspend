import { Component, inject, output, signal, input, effect } from '@angular/core';
import {
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  LucideAngularModule,
  Save,
  X,
} from 'lucide-angular';
import { PaymentMethod } from '../../../core/enums';
import { Category, Transaction, TransactionCreate } from '../../../core/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionServices } from '../../../core/services/transaction';
import { CategoryServices } from '../../../core/services/category';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-transaction-modal',
  imports: [ReactiveFormsModule, CommonModule, LucideAngularModule],
  templateUrl: './transaction-modal.html',
  styles: ``,
})
export class TransactionModal {
  readonly X = X;
  readonly Save = Save;
  readonly DollarSign = DollarSign;
  readonly FileText = FileText;
  readonly Calendar = Calendar;
  readonly CreditCard = CreditCard;
  readonly PaymentMethod = PaymentMethod;

  isOpen = input<boolean>(false);
  transaction = input<Transaction | null>(null);
  onClose = output<void>();
  onSave = output<Transaction>();

  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionServices);
  private categoryService = inject(CategoryServices);

  isLoading = signal(false);
  isEditing = signal(false);

  categories = toSignal(this.categoryService.getCategories(), { initialValue: [] as Category[] });

  transactionForm: FormGroup;

  constructor() {
    this.transactionForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(5)]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      category_id: ['', [Validators.required]],
      date: ['', [Validators.required]],
      payment_method: ['', [Validators.required]],
    });

    effect(() => {
      const transactionData = this.transaction();
      if (transactionData) {
        this.isEditing.set(true);
        this.transactionForm.patchValue({
          description: transactionData.description,
          amount: transactionData.amount,
          category_id: transactionData.category_id,
          date: this.formatDateForInput(transactionData.date),
          payment_method: transactionData.payment_method,
        });
      } else {
        this.isEditing.set(false);
        const today = new Date().toISOString().split('T')[0];
        this.transactionForm.reset({
          description: '',
          amount: 0,
          category_id: '',
          date: today,
          payment_method: '',
        });
      }
    });
  }

  closeModal() {
    const today = new Date().toISOString().split('T')[0];
    this.transactionForm.reset({
      description: '',
      amount: 0,
      category_id: '',
      date: today,
      payment_method: '',
    });
    this.onClose.emit();
  }

  onSubmit() {
    if (this.transactionForm.valid && !this.isLoading()) {
      this.isLoading.set(true);

      const formValue = this.transactionForm.value;
      const transactionData: TransactionCreate = {
        description: formValue.description.trim(),
        amount: parseFloat(formValue.amount),
        category_id: formValue.category_id,
        date: formValue.date,
        payment_method: formValue.payment_method,
      };

      const request = this.isEditing()
        ? this.transactionService.updateTransanction(this.transaction()!.id, transactionData)
        : this.transactionService.createTransaction(transactionData);

      request.subscribe({
        next: (savedBudget) => {
          (this.isLoading.set(false), this.onSave.emit(savedBudget));
          this.closeModal();
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Error saving transaction: ', error);
        },
      });
    }
  }

  getPaymentMethodLabel(method: string) {
    const labels = {
      [PaymentMethod.CASH]: 'Efectivo',
      [PaymentMethod.CREDIT_CARD]: 'Tarjeta de Crédito',
      [PaymentMethod.DEBIT_CARD]: 'Tarjeta de Débido',
      [PaymentMethod.TRANSFER]: 'Transferencia',
      [PaymentMethod.OTHER]: 'otro',
    };

    return labels[method as PaymentMethod] || 'Desconocido';
  }

  formatDate(dataString: string) {
    if (!dataString) return '';

    return new Date(dataString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  private formatDateForInput(dateString: string) {
    return new Date(dateString).toISOString().split('T')[0];
  }
}
