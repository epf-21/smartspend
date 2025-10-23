import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Lock,
  Mail,
  CircleAlert,
  PiggyBank,
  User,
  DollarSign,
} from 'lucide-angular';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [LucideAngularModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styles: ``,
})
export class Register {
  readonly Lock = Lock;
  readonly Mail = Mail;
  readonly UserIcon = User;
  readonly AlertCircle = CircleAlert;
  readonly PiggyBank = PiggyBank;
  readonly DollarSign = DollarSign;

  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.registerForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      currency: ['BOB', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (this.registerForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const registerData = this.registerForm.value;
      console.log(registerData);
      this.authService.register(registerData).subscribe({
        next: () => {
          this.isLoading.set(false);

          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading.set(false);

          if (error.status === 400 && error.error?.detail?.includes('already registered')) {
            this.errorMessage.set('Este email ya está registrado');
          } else {
            this.errorMessage.set('Error al crear la cuenta. Por favor intente de nuevo.');
          }
        },
      });
    }
  }
}
