import { Component, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, Receipt } from 'lucide-angular';
import { TransactionsHeader } from './transactions-header/transactions-header';
import { TransactionsFilters } from './transactions-filters/transactions-filters';
import { TransactionServices } from '../../core/services/transaction';
import { Transaction, TransactionFilters } from '../../core/models';
import { TransactionList } from './transaction-list/transaction-list';
import { CommonModule } from '@angular/common';
import { TransactionModal } from './transaction-modal/transaction-modal';

@Component({
  selector: 'app-transactions',
  imports: [
    CommonModule,
    LucideAngularModule,
    TransactionsHeader,
    TransactionsFilters,
    TransactionList,
    TransactionModal,
  ],
  templateUrl: './transactions.html',
  styles: ``,
})
export class TransactionsComponent {
  readonly Receipt = Receipt;

  private transactionService = inject(TransactionServices);

  isModalOpen = signal<boolean>(false);
  selectedTransaction = signal<Transaction | null>(null);
  transactions = signal<Transaction[]>([]);
  currentFilters = signal<TransactionFilters>({
    search: '',
    category_id: '',
    payment_method: '',
    date_from: '',
    date_to: '',
  });

  constructor() {
    this.loadTransactions();
  }

  filteredTransactions = computed(() => {
    const filters = this.currentFilters();
    let filtered = this.transactions();

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((t) => t.description.toLowerCase().includes(searchLower));
    }

    if (filters.category_id) {
      filtered = filtered.filter((t) => t.category_id === filters.category_id);
    }

    if (filters.payment_method) {
      filtered = filtered.filter((t) => t.payment_method === filters.payment_method);
    }

    if (filters.date_from) {
      filtered = filtered.filter((t) => new Date(t.date) >= new Date(filters.date_from));
    }

    if (filters.date_to) {
      filtered = filtered.filter((t) => new Date(t.date) <= new Date(filters.date_to));
    }

    return filtered;
  });

  private loadTransactions() {
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions.set(transactions);
      },
      error: (error) => {
        console.error('Error loading transactions: ', error);
      },
    });
  }

  getTotalExpenses() {
    return this.filteredTransactions().reduce(
      (total, transaction) => total + transaction.amount,
      0,
    );
  }

  getAverageTransaction() {
    const transactions = this.filteredTransactions();
    if (transactions.length === 0) return 0;
    return this.getTotalExpenses() / transactions.length;
  }

  getThisMonthExpenses() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return this.transactions()
      .filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startOfMonth && transactionDate <= endOfMonth;
      })
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  onFiltersChange(filters: TransactionFilters) {
    this.currentFilters.set(filters);
  }

  openCreateModal() {
    this.selectedTransaction.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(transaction: Transaction) {
    this.selectedTransaction.set(transaction);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedTransaction.set(null);
  }

  onTransactionSaved(savedTransaction: Transaction) {
    if (this.selectedTransaction()) {
      this.transactions.update((transactions) =>
        transactions.map((transaction) =>
          transaction.id === savedTransaction.id ? savedTransaction : transaction,
        ),
      );
    } else {
      this.transactions.update((transactions) => [savedTransaction, ...transactions]);
    }
  }

  deleteTransaction(transaction: Transaction) {
    if (
      confirm(
        `¿Estás seguro de que quieres eliminar esta transaccion: "${transaction.description}"?`,
      )
    ) {
      this.transactionService.deleteTransaction(transaction.id).subscribe({
        next: () => {
          this.transactions.update((transactions) =>
            transactions.filter((t) => t.id !== transaction.id),
          );
        },
        error: (error) => {
          console.error('Error deleting transaction: ', error);
        },
      });
    }
  }
}
