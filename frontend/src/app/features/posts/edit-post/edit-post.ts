import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PostsService } from '../../../core/services/postservice';
import { Post } from '../../../core/models/post';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './edit-post.html',
  styleUrl: './edit-post.scss',
})
export class EditPost {

  private postsService = inject(PostsService);
  private dialogRef = inject(MatDialogRef<EditPost>);
  private data: Post = inject(MAT_DIALOG_DATA);
  private snackBar = inject(MatSnackBar);

  origin = this.data.origin;
  destination = this.data.destination;

  travelDate = this.formatDateForInput(this.data.travelDate);


  travelTimeText = '';
  travelPeriod: 'AM' | 'PM' = 'AM';

  availableSeats = this.data.availableSeats;
  notes = this.data.notes ?? '';
  status = this.data.status;

  saving = false;
  errorMessage = '';

  constructor() {
    const parsed = this.parseTravelTime(this.data.travelTime);
    this.travelTimeText = parsed.time;
    this.travelPeriod = parsed.period;
  }

  private parseTravelTime(value: string): { time: string; period: 'AM' | 'PM' } {
    if (!value) {
      return { time: '', period: 'AM' };
    }

    const upper = value.toUpperCase();
    const period: 'AM' | 'PM' = upper.includes('PM') ? 'PM' : 'AM';

    // Pull out just the digits for hours/minutes, ignoring spaces/colons/AM/PM.
    const digits = value.replace(/[^0-9]/g, '');

    if (digits.length >= 3) {
      const hh = digits.slice(0, digits.length - 2).padStart(2, '0');
      const mm = digits.slice(-2);
      return { time: `${hh}:${mm}`, period };
    }

    return { time: value.replace(/AM|PM/i, '').trim(), period };
  }

  private formatDateForInput(value: string | Date): string {
    const d = new Date(value);
    if (isNaN(d.getTime())) {
      return '';
    }
    return d.toISOString().slice(0, 10);
  }

  save() {

    if (!this.origin || !this.destination || !this.travelDate || !this.travelTimeText || !this.availableSeats) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    this.errorMessage = '';
    this.saving = true;

    this.postsService.updatePost(this.data.id, {
      origin: this.origin,
      destination: this.destination,
      travelDate: this.travelDate,
      travelTime: `${this.travelTimeText} ${this.travelPeriod}`,
      availableSeats: this.availableSeats,
      notes: this.notes,
    }).subscribe({

      next: () => {
        this.saving = false;
        this.snackBar.open('Changes saved successfully', 'Close', {
          duration: 3000,
          panelClass: ['toast-success'],
        });
        this.dialogRef.close(true);
      },

      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.message || 'Failed to update post';
        this.snackBar.open('Changes could not be saved', 'Close', {
          duration: 3500,
          panelClass: ['toast-error'],
        });
      }

    });

  }

  cancel() {
    this.dialogRef.close(false);
  }

}