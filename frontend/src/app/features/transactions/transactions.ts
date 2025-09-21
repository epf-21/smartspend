import { Component } from '@angular/core';
import { CirclePlus, LucideAngularModule, Plus, Search } from 'lucide-angular';

@Component({
  selector: 'app-transactions',
  imports: [LucideAngularModule],
  templateUrl: './transactions.html',
  styles: ``,
})
export class TransactionsComponent {
  readonly Plus = Plus;
  readonly Search = Search;
  readonly CirclePlus = CirclePlus;
}
