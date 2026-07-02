import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  name = '';
  email = '';
  password = '';

  errorMessage = '';

  register() {

    this.errorMessage = '';

    if (!this.name || !this.email || !this.password) {

      this.errorMessage = 'Please fill all the fields';

      return;

    }

    this.authService.register({

      name: this.name,

      email: this.email,

      password: this.password,

    }).subscribe({

      next: () => {

        this.snackBar.open(

          '🎉 Registration Successful!',

          'Close',

          {

            duration: 3000,

            horizontalPosition: 'center',

            verticalPosition: 'top',

          }

        );

        this.router.navigate(['/login']);

      },

      error: (err) => {

        this.errorMessage =
          err.error?.message || 'Registration Failed';

      }

    });

  }

}