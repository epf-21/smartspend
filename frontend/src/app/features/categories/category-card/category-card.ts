import { Component, input, output } from '@angular/core';
import { LucideAngularModule, Pencil, Trash } from 'lucide-angular';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-category-card',
  imports: [LucideAngularModule],
  templateUrl: './category-card.html',
})
export class CategoryCard {
  readonly Pencil = Pencil;
  readonly Trash = Trash;

  category = input.required<Category>();

  editClick = output<Category>();
  deleteClick = output<Category>();

  onEdit() {
    this.editClick.emit(this.category());
  }

  onDelete() {
    this.deleteClick.emit(this.category());
  }
}
