import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PostsService } from '../../../core/services/postservice';
import { Post } from '../../../core/models/post';
import { EditPost } from '../edit-post/edit-post';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './my-posts.html',
  styleUrl: './my-posts.scss'
})
export class MyPosts implements OnInit {

  private postsService = inject(PostsService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  myPosts: Post[] = [];

  loading = true;

  ngOnInit(): void {
    this.loadMyPosts();
  }

  loadMyPosts(): void {

    this.loading = true;

    this.postsService.getMyPosts().subscribe({

      next: (res: any) => {

        this.myPosts = [...res];

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

  editPost(post: Post) {

    const dialogRef = this.dialog.open(EditPost, {
      width: '600px',
      disableClose: true,
      data: post,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMyPosts();
      }
    });

  }

  deletePost(post: Post) {

    const confirmed = confirm(
      `Delete the ride from ${post.origin} to ${post.destination}? This can't be undone.`
    );

    if (!confirmed) {
      return;
    }

    this.postsService.deletePost(post.id).subscribe({

      next: () => {
        this.loadMyPosts();
      },

      error: (err) => {
        console.error(err);
      }

    });

  }

}