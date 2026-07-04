import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatCardModule }            from '@angular/material/card';
import { MatButtonModule }          from '@angular/material/button';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatSelectModule }          from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule }            from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Post }       from '../../../core/models/post';
import { Pagination } from '../../../core/models/pagination';

import { PostsService }     from '../../../core/services/postservice';
import { InterestsService } from '../../../core/services/interests.service';
import { MyPosts }          from '../my-posts/my-posts';
import { PostDetails }      from '../post-details/post-details';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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

  private postsService     = inject(PostsService);
  private interestsService = inject(InterestsService);
  private cdr              = inject(ChangeDetectorRef);
  private dialog           = inject(MatDialog);
  private fb               = inject(FormBuilder);

  posts: Post[] = [];
  selectedTab: 'feed' | 'myPosts' = 'feed';
  // interestedPostIds = new Set<string>();
  interestedPostIds = new Set<string>();
interestingPostIds = new Set<string>();   
  interestError = '';

  pagination!: Pagination;
  loading = true;

  origin      = '';
  destination = '';
  status      = '';
  travelDate  = '';
  seats       = '';
  sortBy      = 'latest';
  page        = 1;
  // Exactly 3 cards per page (one row) so every card can show full
  // detail without being clipped, and the page never scrolls.
  limit       = 3;

  creating = false;
createForm = this.fb.group({
  origin: ['', Validators.required],
  destination: ['', Validators.required],
  travelDate: ['', Validators.required],

  travelTime: ['', Validators.required],   
  period: ['AM', Validators.required],     

  availableSeats: [1, [Validators.required, Validators.min(1)]],
  notes: [''],
});

  ngOnInit(): void {
    this.loadPosts();
  }

  get totalRides(): number {
    const p = this.pagination as any;
    return p?.total ?? p?.totalItems ?? p?.totalCount ?? this.posts.length;
  }

  get activeCount(): number {
    return this.posts.filter(p => p.status === 'ACTIVE').length;
  }

  get verifiedCount(): number {
    const owners = new Set(this.posts.map(p => p.owner?.email).filter(Boolean));
    return owners.size;
  }

  selectTab(tab: 'feed' | 'myPosts'): void {
    this.selectedTab = tab;
    if (tab === 'feed') this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;

    this.postsService
      .getPosts(this.page, this.limit, this.origin, this.destination, this.status, this.travelDate)
      .subscribe({
        next: (response) => {
          this.posts      = [...response.data];
          this.pagination = response.pagination;
          this.loading    = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  viewDetails(post: Post): void {
    this.dialog.open(PostDetails, { width: '520px', data: post });
  }

 expressInterest(post: Post): void {

  if (this.interestedPostIds.has(post.id) || this.interestingPostIds.has(post.id)) {
    return;
  }

  this.interestError = '';
  this.interestingPostIds.add(post.id);

  this.interestsService.expressInterest(post.id).subscribe({
    next: () => {
      this.interestingPostIds.delete(post.id);
      this.interestedPostIds.add(post.id);
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.interestingPostIds.delete(post.id);
      if (err.status === 400) {
        this.interestedPostIds.add(post.id);
      } else {
        this.interestError = err.error?.message || 'Could not express interest';
      }
      this.cdr.detectChanges();
    },
  });
}

submitCreate(): void {

  if (this.createForm.invalid) {
    this.createForm.markAllAsTouched();
    return;
  }

  this.creating = true;


  

  const payload = {
    origin: this.createForm.get('origin')?.value,
    destination: this.createForm.get('destination')?.value,
    travelDate: this.createForm.get('travelDate')?.value,
   travelTime:
  `${this.createForm.value.travelTime} ${this.createForm.value.period}`,
    availableSeats: Number(this.createForm.get('availableSeats')?.value),
    notes: this.createForm.get('notes')?.value ?? '',
  };

  this.postsService.createPost(payload).subscribe({
  next: (createdPost: any) => {

    this.creating = false;

    this.createForm.reset({
      origin: '',
      destination: '',
      travelDate: '',
      travelTime: '',
      period: 'AM',
      availableSeats: 1,
      notes: '',
    });

    // Show the new ride right away rather than relying on the
    // backend's sort/pagination to surface it on page 1.
    const newPost: Post = createdPost?.data ?? createdPost;
    this.page = 1;
    this.posts = [newPost, ...this.posts].slice(0, this.limit);
    this.cdr.detectChanges();

    // Still resync with the server in the background so pagination
    // totals stay correct.
    this.loadPosts();
  },

  error: (err) => {
    this.creating = false;
    console.error(err);
  }
});

}
search(): void {

  this.origin = this.origin.trim();
  this.destination = this.destination.trim();

  this.page = 1;

  this.loadPosts();

}



nsearch(): void {
  this.page = 1;
  this.loadPosts();
}

previousPage(): void {
  if (this.pagination?.hasPreviousPage) {
    this.page--;
    this.loadPosts();
  }
}

nextPage(): void {
  if (this.pagination?.hasNextPage) {
    this.page++;
    this.loadPosts();
  }
}


goToPage(page: number): void {
  if (!this.pagination || page === this.pagination.page) {
    return;
  }

  this.page = page;
  this.loadPosts();
}
  pageNumbers(): number[] {
    const total   = this.pagination?.totalPages || 1;
    const current = this.pagination?.page       || 1;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: number[] = [1];
    if (current > 3) pages.push(-1);

    const start = Math.max(2, current - 1);
    const end   = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push(-1);
    pages.push(total);

    return pages;
  }
}