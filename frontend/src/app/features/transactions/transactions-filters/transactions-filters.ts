import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Calendar, CreditCard, ListFilter, LucideAngularModule, Search } from 'lucide-angular';
import { PaymentMethod } from '../../../core/enums';
import { CategoryServices } from '../../../core/services/category';
import { toSignal } from '@angular/core/rxjs-interop';
import { Category, TransactionFilters } from '../../../core/models';

@Component({
  selector: 'app-transactions-filters',
  imports: [LucideAngularModule, FormsModule],
  templateUrl: './transactions-filters.html',
  styles: ``,
})
export class TransactionsFilters {
  readonly Search = Search;
  readonly ListFilter = ListFilter;
  readonly Calendar = Calendar;
  readonly CreditCard = CreditCard;
  readonly PaymentMethod = PaymentMethod;

  private categoryService = inject(CategoryServices);

  categories = toSignal(this.categoryService.getCategories(), { initialValue: [] as Category[] });

  filters: TransactionFilters = {
    search: '',
    category_id: '',
    payment_method: '',
    date_from: '',
    date_to: '',
  };

  filtersChange = output<TransactionFilters>();

  onFiltersChange() {
    this.filtersChange.emit(this.filters);
  }

  hasActiveFilters() {
    return !!(
      this.filters.search ||
      this.filters.category_id ||
      this.filters.payment_method ||
      this.filters.date_from ||
      this.filters.date_to
    );
  }

  clearFilters() {
    this.filters = {
      search: '',
      category_id: '',
      payment_method: '',
      date_from: '',
      date_to: '',
    };
    this.onFiltersChange();
  }
}
