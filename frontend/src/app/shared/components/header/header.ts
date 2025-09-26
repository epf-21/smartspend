import { Component, HostListener, output, signal } from '@angular/core';
import {
  LucideAngularModule,
  Menu,
  CircleUser,
  ChevronDown,
  FolderCog,
  Cog,
  LogOut,
} from 'lucide-angular';

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

  toggleSidebar = output<void>();

  isUserMenuOpen = signal<boolean>(false);

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
}
