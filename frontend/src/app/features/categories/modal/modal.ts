import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Palette, Save, X } from 'lucide-angular';
import { Category, CategoryCreate, CategoryUpdate } from '../../../core/models';
import { CategoryServices } from '../../../core/services/category';

@Component({
  selector: 'app-modal',
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './modal.html',
})
export class Modal {
  readonly X = X;
  readonly Save = Save;
  readonly Palette = Palette;

  isOpen = input<boolean>(false);
  category = input<Category | null>(null);
  onClose = output<void>();
  onSave = output<Category>();

  private fb = inject(FormBuilder);
  private categoryServices = inject(CategoryServices);

  isLoading = signal(false);
  isEditMode = signal(false);

  categoryForm: FormGroup;

  predefinedColors = [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#ef4444',
    '#f59e0b',
    '#10b981',
    '#06b6d4',
    '#84cc16',
    '#f97316',
    '#6366f1',
    '#64748b',
    '#374151',
  ];

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      color: ['#6366f1', [Validators.required]],
      icon: ['', [Validators.required]],
    });

    effect(() => {
      const categoryData = this.category();
      if (categoryData) {
        this.isEditMode.set(true);
        this.categoryForm.patchValue({
          name: categoryData.name,
          color: categoryData.color,
          icon: categoryData.icon,
        });
      } else {
        this.isEditMode.set(false);
        this.categoryForm.reset({
          name: '',
          color: '#6366f1',
          icon: '',
        });
      }
    });
  }

  selectColor(color: string) {
    this.categoryForm.patchValue({ color });
  }

  closeModal() {
    this.categoryForm.reset({
      name: '',
      color: '#6366f1',
      icon: '',
    });

    this.onClose.emit();
  }

  onSubmit() {
    if (this.categoryForm.valid && !this.isLoading()) {
      this.isLoading.set(true);

      const formValue = this.categoryForm.value;

      const categoryData = {
        name: formValue.name.trim(),
        color: formValue.color,
        icon: formValue.icon.trim(),
      };

      const request = this.isEditMode()
        ? this.categoryServices.updateCategory(this.category()!.id, categoryData as CategoryUpdate)
        : this.categoryServices.createCategory(categoryData as CategoryCreate);

      console.log('request object::::::', request);
      request.subscribe({
        next: (savedCategory) => {
          this.isLoading.set(false);
          this.onSave.emit(savedCategory);
          this.closeModal();
        },
        error: (error) => {
          this.isLoading.set(false);
          console.error('Error saving category: ', error);
        },
      });
    }
  }
}
