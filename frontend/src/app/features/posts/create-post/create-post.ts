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

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PostsService } from '../../../core/services/postservice';


@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
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

    notes: [''],

  });

  createPost() {

    if (this.postForm.invalid) {

      this.postForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    this.postsService.createPost(
      this.postForm.value
    ).subscribe({

      next: () => {

        this.loading = false;

        this.snackBar.open(

          'Post created successfully',

          'Close',

          {

            duration: 3000,

          }

        );

        this.dialogRef.close(true);

      },

      error: () => {

        this.loading = false;

        this.snackBar.open(

          'Failed to create post',

          'Close',

          {

            duration: 3000,

          }

        );

      }

    });

  }

  close() {

    this.dialogRef.close(false);

  }

}