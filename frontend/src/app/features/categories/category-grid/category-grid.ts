import { Component, input, output } from '@angular/core';
import { LucideAngularModule, Search } from 'lucide-angular';
import { CategoryCard } from '../category-card/category-card';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-category-grid',
  imports: [LucideAngularModule, CategoryCard],
  templateUrl: './category-grid.html',
  styles: ``,
})
export class CategoryGrid {
  readonly Search = Search;

  categories = input.required<Category[]>();
  editCategory = output<Category>();
  deleteCategory = output<Category>();

  onEditCategory(category: Category) {
    this.editCategory.emit(category);
  }

  onDeleteCategory(category: Category) {
    this.deleteCategory.emit(category);
  }
}
