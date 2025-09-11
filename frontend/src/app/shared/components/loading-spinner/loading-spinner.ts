import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  templateUrl: './loading-spinner.html',
  styles: ``,
})
export class LoadingSpinner {
  size = input<string>('medium');
  message = input<string>('');
}
