import { Component, output } from '@angular/core';
import { LucideAngularModule, Plus, Receipt } from 'lucide-angular';

@Component({
  selector: 'app-transactions-header',
  imports: [LucideAngularModule],
  templateUrl: './transactions-header.html',
})
export class TransactionsHeader {
  readonly Plus = Plus;
  readonly Receipt = Receipt;

  newTransactionClick = output<void>();

  onNewTransaction() {
    this.newTransactionClick.emit();
  }
}
