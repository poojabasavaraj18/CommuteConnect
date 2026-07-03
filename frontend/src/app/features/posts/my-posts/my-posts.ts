import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsService } from '../../../core/services/postservice';
import { Post } from '../../../core/models/post';

@Component({
  selector: 'app-my-posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-posts.html',
  styleUrl: './my-posts.scss'
})
export class MyPosts implements OnInit {

  private postsService = inject(PostsService);
  private cdr = inject(ChangeDetectorRef);

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

}