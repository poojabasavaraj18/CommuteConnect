import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PostsService } from '../../../core/services/postservice';
import { Post } from '../../../core/models/post';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './edit-post.html',
  styleUrl: './edit-post.scss',
})
export class EditPost {

  private postsService = inject(PostsService);
  private dialogRef = inject(MatDialogRef<EditPost>);
  private data: Post = inject(MAT_DIALOG_DATA);

  origin = this.data.origin;
  destination = this.data.destination;

  // Prisma stores a full DateTime; the <input type="date"> control
  // only wants the yyyy-MM-dd portion.
  travelDate = this.formatDateForInput(this.data.travelDate);

  travelTime = this.data.travelTime;
  availableSeats = this.data.availableSeats;
  notes = this.data.notes ?? '';
  status = this.data.status;

  saving = false;
  errorMessage = '';

  private formatDateForInput(value: string | Date): string {
    const d = new Date(value);
    if (isNaN(d.getTime())) {
      return '';
    }
    return d.toISOString().slice(0, 10);
  }

  save() {

    if (!this.origin || !this.destination || !this.travelDate || !this.travelTime || !this.availableSeats) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    this.errorMessage = '';
    this.saving = true;

    this.postsService.updatePost(this.data.id, {
      origin: this.origin,
      destination: this.destination,
      travelDate: this.travelDate,
      travelTime: this.travelTime,
      availableSeats: this.availableSeats,
      notes: this.notes,
    }).subscribe({

      next: () => {
        this.saving = false;
        this.dialogRef.close(true);
      },

      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.message || 'Failed to update post';
      }

    });

  }

  cancel() {
    this.dialogRef.close(false);
  }

}