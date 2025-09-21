import { Component, inject } from '@angular/core';
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

  categories = toSignal(this.categoryServices.getCategories(), { initialValue: [] as Category[] });
}
