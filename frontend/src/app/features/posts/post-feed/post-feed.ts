import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Post } from '../../../core/models/post';
import { Pagination } from '../../../core/models/pagination';

import { CreatePost } from '../create-post/create-post';
import { PostsService } from '../../../core/services/postservice';
import { MyPosts } from '../my-posts/my-posts';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    MyPosts,
  ],
  templateUrl: './post-feed.html',
  styleUrl: './post-feed.scss',
})
export class PostFeed implements OnInit {

  private postsService = inject(PostsService);
  private cdr = inject(ChangeDetectorRef);

  private dialog = inject(MatDialog);

  posts: Post[] = [];
  selectedTab: 'feed' | 'myPosts' = 'feed';

  selectTab(tab: 'feed' | 'myPosts') {
    this.selectedTab = tab;

    if (tab === 'feed') {
      this.loadPosts();
    }
  }

  pagination!: Pagination;

  loading = true;

  origin = '';

  destination = '';

  status = '';

  travelDate = '';

  page = 1;

  limit = 10;

  ngOnInit(): void {

    this.loadPosts();

  }

  loadPosts() {

    this.loading = true;

    this.postsService.getPosts(
      this.page,
      this.limit,
      this.origin,
      this.destination,
      this.status,
      this.travelDate
    ).subscribe({

      next: (response) => {

        this.posts = [...response.data];
        this.pagination = response.pagination;
        this.loading = false;
        this.cdr.detectChanges();

      },

      error: () => {

        this.loading = false;
        this.cdr.detectChanges();

      }

    });

  }

  openCreatePost() {

    const dialogRef = this.dialog.open(CreatePost, {

      width: '800px',

      disableClose: true,

    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) return;

      if (this.selectedTab === 'feed') {
        this.loadPosts();
      }

    });
  }

  search() {
    this.page = 1;
    this.loadPosts();
  }

  reset() {
    this.origin = '';
    this.destination = '';
    this.status = '';
    this.travelDate = '';
    this.page = 1;
    this.loadPosts();
  }

  previousPage() {
    if (this.pagination?.hasPreviousPage) {
      this.page--;
      this.loadPosts();
    }
  }

  nextPage() {
    if (this.pagination?.hasNextPage) {
      this.page++;
      this.loadPosts();
    }
  }

}