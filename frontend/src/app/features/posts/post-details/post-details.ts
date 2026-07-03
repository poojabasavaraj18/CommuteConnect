import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Post } from '../../../core/models/post';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './post-details.html',
  styleUrl: './post-details.scss',
})
export class PostDetails {

  private dialogRef = inject(MatDialogRef<PostDetails>);

  post: Post = inject(MAT_DIALOG_DATA);

  close() {
    this.dialogRef.close();
  }

}