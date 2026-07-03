import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { PostsService } from '../../../core/services/postservice';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss',
})
export class CreatePost {

  private fb = inject(FormBuilder);
  private postsService = inject(PostsService);
  private dialogRef = inject(MatDialogRef<CreatePost>);
  private snackBar = inject(MatSnackBar);

  loading = false;
  errorMsg = '';

  postForm = this.fb.group({
    origin: ['', Validators.required],
    destination: ['', Validators.required],
    travelDate: ['', Validators.required],
    travelTime: ['', Validators.required],
    availableSeats: [
      1,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],

    // UI ONLY
    rideType: ['CAR'],

    notes: [''],
  });

  get notesCount(): number {
    return this.postForm.get('notes')?.value?.length ?? 0;
  }

  createPost(): void {

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    // Backend accepts ONLY these fields
    const payload = {
      origin: this.postForm.get('origin')?.value,
      destination: this.postForm.get('destination')?.value,
      travelDate: this.postForm.get('travelDate')?.value,
      travelTime: this.postForm.get('travelTime')?.value,
      availableSeats: Number(this.postForm.get('availableSeats')?.value),
      notes: this.postForm.get('notes')?.value,
    };

    console.log('Payload Sent');
    console.log(payload);

    this.postsService.createPost(payload).subscribe({

      next: () => {

        this.loading = false;

        this.snackBar.open(
          'Ride created successfully',
          'Close',
          {
            duration: 3000,
          }
        );

        this.dialogRef.close(true);

      },

      error: (err) => {

        this.loading = false;

        console.error(err);

        this.errorMsg =
          err?.error?.message?.join(', ') ??
          err?.error?.message ??
          'Failed to create ride';

      },

    });

  }

  close(): void {
    this.dialogRef.close(false);
  }

}