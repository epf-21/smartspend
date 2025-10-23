import { Component, HostListener, inject, output, signal } from '@angular/core';
import {
  LucideAngularModule,
  Menu,
  CircleUser,
  ChevronDown,
  FolderCog,
  Cog,
  LogOut,
  User,
  PiggyBank,
} from 'lucide-angular';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule],
  templateUrl: './header.html',
})
export class Header {
  readonly Menu = Menu;
  readonly CircleUser = CircleUser;
  readonly ChevronDown = ChevronDown;
  readonly FolderCog = FolderCog;
  readonly Cog = Cog;
  readonly LogOut = LogOut;
  readonly UserIcon = User;
  readonly PiggyBank = PiggyBank;

  private authService = inject(Auth);

  toggleSidebar = output<void>();
  isUserMenuOpen = signal<boolean>(false);

  currentUser = this.authService.user;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('[aria-label="User menu"]') && !target.closest('.absolute')) {
      this.isUserMenuOpen.set(false);
    }
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update((isOpen) => !isOpen);
  }

  closeUserMenu() {
    this.isUserMenuOpen.set(false);
  }

  onLogout() {
    this.authService.logout();
    this.isUserMenuOpen.set(false);
  }

  getUserInitials() {
    const user = this.currentUser();
    if (!user) return '??';

    const names = user.full_name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return user.full_name.substring(0, 2).toUpperCase();
  }
}
