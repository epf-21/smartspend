import { Component, output } from '@angular/core';
import { LucideAngularModule, Plus, Tag } from 'lucide-angular';

@Component({
  selector: 'app-category-header',
  imports: [LucideAngularModule],
  templateUrl: './category-header.html',
  styles: ``,
})
export class CategoryHeader {
  readonly Plus = Plus;
  readonly Tag = Tag;
  newCategoryClick = output<void>();

  onNewCategory() {
    this.newCategoryClick.emit();
  }
}
