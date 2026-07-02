import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';

  errorMessage = '';

  register() {

    console.log('Register button clicked');

    this.errorMessage = '';

    this.authService.register({

      name: this.name,

      email: this.email,

      password: this.password,

    }).subscribe({

      next: (res) => {

        console.log('Registration Success', res);

        alert('Registration Successful');

        this.router.navigate(['/login']);

      },

      error: (err) => {

        console.error(err);

        this.errorMessage =
          err.error?.message || 'Registration Failed';

      }

    });

  }

}