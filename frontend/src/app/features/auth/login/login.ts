import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
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

    console.log('Login button clicked');

    this.errorMessage = '';

    this.authService.login({
      email: this.email,
      password: this.password,
    }).subscribe({

     next: (res: any) => {

  console.log('Login Success');

  console.log(res);

  this.authService.saveToken(res.access_token);

  console.log(localStorage.getItem('token'));

  this.router.navigate(['/dashboard']);

},

      error: (err) => {

        console.error(err);

        this.errorMessage =
          err.error?.message || 'Login Failed';

      }

    });

  }

}