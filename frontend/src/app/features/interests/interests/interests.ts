import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { InterestsService } from '../../../core/services/interests.service';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-interests',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './interests.html',
  styleUrl: './interests.scss',
})
export class Interests implements OnInit {

  private interestsService = inject(InterestsService);
  private cdr = inject(ChangeDetectorRef);

  sentInterests: any[] = [];
  receivedInterests: any[] = [];

  loadingSent = true;
  loadingReceived = true;

  withdrawInProgress: Record<string, boolean> = {};
  respondInProgress: Record<string, boolean> = {};

  private avatarColors = [
    'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', // blue
    'linear-gradient(135deg, #059669 0%, #047857 100%)', // green
    'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)', // violet
    'linear-gradient(135deg, #0891b2 0%, #155e75 100%)', // teal
    'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', // orange
    'linear-gradient(135deg, #4338ca 0%, #312e81 100%)', // indigo
  ];

  ngOnInit(): void {
    this.loadSent();
    this.loadReceived();
  }

  loadSent(): void {
    this.loadingSent = true;

    this.interestsService.myInterests().subscribe({
      next: (res) => {
        this.sentInterests = [...res];
        this.loadingSent = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading sent interests:', err);
        this.loadingSent = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadReceived(): void {
    this.loadingReceived = true;

    this.interestsService.receivedInterests().subscribe({
      next: (res) => {
        this.receivedInterests = [...res];
        this.loadingReceived = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading received interests:', err);
        this.loadingReceived = false;
        this.cdr.detectChanges();
      }
    });
  }

  withdraw(postId: string): void {
    const confirmed = confirm('Withdraw your interest in this ride?');
    if (!confirmed) return;

    this.withdrawInProgress[postId] = true;

    this.interestsService.removeInterest(postId).subscribe({
      next: () => {
        this.withdrawInProgress[postId] = false;
        this.loadSent();
      },
      error: (err) => {
        console.error('Error withdrawing interest:', err);
        this.withdrawInProgress[postId] = false;
        this.cdr.detectChanges();
      }
    });
  }

  accept(item: any): void {
    this.respond(item, 'ACCEPTED');
  }

  reject(item: any): void {
    this.respond(item, 'REJECTED');
  }

  private respond(item: any, status: 'ACCEPTED' | 'REJECTED'): void {
    this.respondInProgress[item.id] = true;

    this.interestsService.updateStatus(item.id, status).subscribe({
      next: (updated) => {
        item.status = updated.status;
        this.respondInProgress[item.id] = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error responding to interest:', err);
        this.respondInProgress[item.id] = false;
        this.cdr.detectChanges();
      }
    });
  }

  getAvatarColor(name: string): string {
    if (!name) return this.avatarColors[0];
    const charCode = name.charCodeAt(0);
    return this.avatarColors[charCode % this.avatarColors.length];
  }

  get sentCount(): number { return this.sentInterests.length; }
  get receivedCount(): number { return this.receivedInterests.length; }

  get acceptedCount(): number {
    return this.receivedInterests.filter(i => i.status === 'ACCEPTED').length +
           this.sentInterests.filter(i => i.status === 'ACCEPTED').length;
  }

  get rejectedCount(): number {
    return this.receivedInterests.filter(i => i.status === 'REJECTED').length +
           this.sentInterests.filter(i => i.status === 'REJECTED').length;
  }
}