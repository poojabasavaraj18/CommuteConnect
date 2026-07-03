import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { InterestsService } from '../../../core/services/interests.service';

@Component({
  selector: 'app-interests',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './interests.html',
  styleUrl: './interests.scss',
})
export class Interests implements OnInit {

  private interestsService = inject(InterestsService);
  private cdr = inject(ChangeDetectorRef);

  selectedTab: 'sent' | 'received' = 'sent';

  sentInterests: any[] = [];
  receivedInterests: any[] = [];

  loading = true;

  ngOnInit(): void {
    this.loadSent();
  }

  selectTab(tab: 'sent' | 'received') {

    this.selectedTab = tab;

    if (tab === 'sent') {
      this.loadSent();
    } else {
      this.loadReceived();
    }

  }

  loadSent() {

    this.loading = true;

    this.interestsService.myInterests().subscribe({

      next: (res) => {
        this.sentInterests = [...res];
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

  loadReceived() {

    this.loading = true;

    this.interestsService.receivedInterests().subscribe({

      next: (res) => {
        this.receivedInterests = [...res];
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

  // Withdraw an interest you sent. Only the person who expressed
  // interest can do this — the backend's removeInterest checks
  // against req.user.userId, not the post owner.
  withdraw(postId: string) {

    const confirmed = confirm('Withdraw your interest in this ride?');

    if (!confirmed) {
      return;
    }

    this.interestsService.removeInterest(postId).subscribe({

      next: () => {
        this.loadSent();
      },

      error: (err) => {
        console.error(err);
      }

    });

  }

  accept(item: any) {
    this.respond(item, 'ACCEPTED');
  }

  reject(item: any) {
    this.respond(item, 'REJECTED');
  }

  private respond(item: any, status: 'ACCEPTED' | 'REJECTED') {

    this.interestsService.updateStatus(item.id, status).subscribe({

      next: (updated) => {
        // Update the item in place rather than re-fetching,
        // so the list doesn't jump/reload for a small change.
        item.status = updated.status;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
      }

    });

  }

}