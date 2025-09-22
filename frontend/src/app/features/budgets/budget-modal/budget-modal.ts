import { Component, inject, input, output, signal, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Calendar, DollarSign, LucideAngularModule, Save, X } from 'lucide-angular';
import { BudgetPeriod } from '../../../core/enums';
import { Budget, BudgetCreate, Category } from '../../../core/models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetService } from '../../../core/services/budget';
import { CategoryServices } from '../../../core/services/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budget-modal',
  imports: [ReactiveFormsModule, CommonModule, LucideAngularModule],
  templateUrl: './budget-modal.html',
})
export class BugetModal {
  readonly X = X;
  readonly Save = Save;
  readonly Calendar = Calendar;
  readonly DollarSign = DollarSign;
  readonly BudgetPeriod = BudgetPeriod;

  isOpen = input<boolean>(false);
  budget = input<Budget | null>(null);
  onClose = output<void>();
  onSave = output<Budget>();

  private fb = inject(FormBuilder);
  private budgetService = inject(BudgetService);
  private categoryService = inject(CategoryServices);

  isLoading = signal(false);
  isEditMode = signal(false);

  categories = toSignal(this.categoryService.getCategories(), { initialValue: [] as Category[] });

  budgetForm: FormGroup;

  constructor() {
    this.budgetForm = this.fb.group({
      category_id: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      period: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: [''],
      is_active: [true],
    });

    effect(() => {
      const budgetData = this.budget();
      if (budgetData) {
        this.isEditMode.set(true);
        this.budgetForm.patchValue({
          category_id: budgetData.category_id,
          amount: budgetData.amount,
          period: budgetData.period,
          start_date: this.formatDateForInput(budgetData.start_date),
          end_date: budgetData.end_date ? this.formatDateForInput(budgetData.end_date) : '',
          is_active: budgetData.is_active,
        });
      } else {
        this.isEditMode.set(false);
        this.budgetForm.reset({
          category_id: '',
          amount: 0,
          period: '',
          start_date: '',
          end_date: '',
          is_active: true,
        });
      }
    });
  }

  closeModal(): void {
    this.budgetForm.reset({
      category_id: '',
      amount: 0,
      period: '',
      start_date: '',
      end_date: '',
      is_active: true,
    });
    this.onClose.emit();
  }

  onSubmit(): void {
    if (this.budgetForm.valid && !this.isLoading()) {
      this.isLoading.set(true);

      const formValue = this.budgetForm.value;
      const budgetData: BudgetCreate = {
        category_id: formValue.category_id,
        amount: parseFloat(formValue.amount),
        period: formValue.period,
        start_date: formValue.start_date,
        end_date: formValue.end_date || null,
        is_active: formValue.is_active,
      };

      const request = this.isEditMode()
        ? this.budgetService.updateBudget(this.budget()!.id, budgetData)
        : this.budgetService.createBudget(budgetData);

      request.subscribe({
        next: (savedBudget) => {
          this.isLoading.set(false);
          this.onSave.emit(savedBudget);
          this.closeModal();
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Error saving budget:', error);
        },
      });
    }
  }

  getPeriodLabel(period: string): string {
    const labels = {
      [BudgetPeriod.WEEKLY]: 'Semanal',
      [BudgetPeriod.MONTHLY]: 'Mensual',
      [BudgetPeriod.QUARTERLY]: 'Trimestral',
      [BudgetPeriod.YEARLY]: 'Anual',
    };
    return labels[period as BudgetPeriod] || 'Desconocido';
  }

  private formatDateForInput(dateString: string): string {
    return new Date(dateString).toISOString().split('T')[0];
  }
}
