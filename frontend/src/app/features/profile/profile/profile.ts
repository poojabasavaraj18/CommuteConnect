import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UsersService } from '../../../core/services/profile.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})


export class Profile implements OnInit {

  private usersService = inject(UsersService);
  private cdr = inject(ChangeDetectorRef);

  profile: any = null;

  loading = true;

  editing = false;

  name = '';
  email = '';

  saving = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadProfile();
  }

private router = inject(Router);

close(): void {
  this.router.navigate(['/dashboard']);
}

  loadProfile() {

    this.loading = true;

    this.usersService.getProfile().subscribe({

      next: (res) => {
        this.profile = res;
        this.name = res.name;
        this.email = res.email;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }

    });

  }

  getInitials(name?: string): string {

    if (!name) {
      return '?';
    }

    const parts = name.trim().split(/\s+/);

    return parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || '?';

  }

  startEditing() {
    this.editing = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.name = this.profile.name;
    this.email = this.profile.email;
  }

  cancelEditing() {
    this.editing = false;
    this.errorMessage = '';
  }

  saveProfile() {

    this.errorMessage = '';

    if (!this.name || !this.email) {
      this.errorMessage = 'Name and email cannot be empty';
      return;
    }

    this.saving = true;

    this.usersService.updateProfile({
      name: this.name,
      email: this.email,
    }).subscribe({

      next: (res) => {
        this.profile = res;
        this.saving = false;
        this.editing = false;
        this.successMessage = 'Profile updated successfully';
        this.cdr.detectChanges();
      },

      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.message || 'Failed to update profile';
        this.cdr.detectChanges();
      }

    });

  }

}
