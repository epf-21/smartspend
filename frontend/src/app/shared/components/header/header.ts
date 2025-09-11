import { Component } from '@angular/core';
import {
  LucideAngularModule,
  Menu,
  CircleUser,
  ChevronDown,
  FolderCog,
  Cog,
  LogOut,
} from 'lucide-angular';
import { Currency } from '../../../core/enums';

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

  selectedCurrency: Currency = Currency.BOB;
  currencies = Object.values(Currency);
  isUserMenuOpen = false;

  logout(): void {}
}
