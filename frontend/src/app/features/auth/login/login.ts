import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';

  password = '';

  errorMessage = '';

  showPassword = false;

  loading = false;

  login() {

    this.errorMessage = '';

    if (!this.email || !this.password) {

      this.errorMessage = 'Please fill all the fields';

      return;

    }

    this.loading = true;

    this.authService.login({

      email: this.email,

      password: this.password,

    }).subscribe({

      next: (res) => {

        this.authService.saveToken(res.access_token);

        this.router.navigate(['/dashboard']);

        // Intentionally not resetting `loading` here — we're
        // navigating away, so the spinner just stays until the
        // route change swaps the page out.

      },

      error: (err) => {

        this.errorMessage =
          err.error?.message || 'Login Failed';

        this.loading = false;

      }

    });

  }
}