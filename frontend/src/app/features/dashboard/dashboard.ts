import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  imports: [Header, Sidebar],
  templateUrl: './dashboard.html',
})
export class Dashboard {}
