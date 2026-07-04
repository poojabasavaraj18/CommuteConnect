import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { InterestsService } from '../../../core/services/interests.service';

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
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
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