import { Component, output } from '@angular/core';
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

  isUserMenuOpen = false;

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
  getUserInitials(): string {
    return 'user name';
  }
  logout(): void {}
}
