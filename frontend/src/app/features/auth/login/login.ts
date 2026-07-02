import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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

  login() {

  this.errorMessage = '';

  if (!this.email || !this.password) {

    this.errorMessage = 'Please fill all the fields';

    return;

  }

  this.authService.login({

    email: this.email,

    password: this.password,

  }).subscribe({

    next: (res) => {

      this.authService.saveToken(res.access_token);

      this.router.navigate(['/dashboard']);

    },

    error: (err) => {

      this.errorMessage =
        err.error?.message || 'Login Failed';

    }

  });

}
}