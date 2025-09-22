import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule, Pencil, Plus, Tag, Trash } from 'lucide-angular';
import { CategoryServices } from '../../core/services/category';
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

  categories = signal<Category[]>([]);

  constructor() {
    this.loadCategories();
  }

  private loadCategories() {
    this.categoryServices.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error) => {
        console.error('Error loading categories: ', error);
      },
    });
  }

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
    if (this.selectedCategory()) {
      this.categories.update((categories) =>
        categories.map((cat) => (cat.id === savedCategory.id ? savedCategory : cat)),
      );
    } else {
      this.categories.update((categories) => [...categories, savedCategory]);
    }
  }

  deleteCategory(category: Category) {
    if (confirm(`¿Estás seguro de que quieres eliminar la categoria "${category.name}"?`)) {
      this.categoryServices.deleteCategory(category.id).subscribe({
        next: () => {
          this.categories.update((categories) =>
            categories.filter((cat) => cat.id !== category.id),
          );
        },
        error: (error) => {
          console.error('Error deleting cateogory: ', error);
        },
      });
    }
  }
}
