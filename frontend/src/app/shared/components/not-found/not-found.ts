import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="flex items-center justify-center min-h-[80vh] bg-gray-50">
      <div class="text-center bg-white px-8 py-12 rounded-2xl shadow-lg">
        <h1 class="text-7xl font-extrabold text-blue-500 tracking-widest mb-2">404</h1>
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Oops! Page not found</h2>
        <p class="text-gray-500 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <a
          routerLink="/dashboard"
          class="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  `,
})
export class NotFound {}
