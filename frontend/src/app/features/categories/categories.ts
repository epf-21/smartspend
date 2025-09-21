import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule, Pencil, Plus, Tag, Trash } from 'lucide-angular';
import { CategoryServices } from '../../core/services/category';
import { toSignal } from '@angular/core/rxjs-interop';
import { Category } from '../../core/models';
import { Modal } from './modal/modal';

@Component({
  selector: 'app-categories',
  imports: [LucideAngularModule, Modal],
  templateUrl: './categories.html',
  styles: ``,
})
export class CategoriesComponent {
  readonly Plus = Plus;
  readonly Tag = Tag;
  readonly Pencil = Pencil;
  readonly Trash = Trash;
  private categoryServices = inject(CategoryServices);

  isModalOpen = signal<boolean>(false);
  selectedCategory = signal<Category | null>(null);

  categories = toSignal(this.categoryServices.getCategories(), { initialValue: [] as Category[] });

  openCreateModal() {
    this.selectedCategory.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(category: Category) {
    this.selectedCategory.set(category);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedCategory.set(null);
  }

  onCategorySaved(savedCategory: Category) {
    this.categoryServices.getCategories().subscribe((categories) => {});
  }

  deleteCategory(category: Category) {
    if (confirm(`¿Estás seguro de que quieres eliminar la categoria "${category.name}"?`)) {
      this.categoryServices.deleteCategory(category.id).subscribe({
        next: () => {
          this.categoryServices.getCategories().subscribe();
        },
        error: (error) => {
          console.error('Error deleting cateogory: ', error);
        },
      });
    }
  }
}
