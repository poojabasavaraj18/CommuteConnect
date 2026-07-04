import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
import { NotificationService } from '../../../core/services/notification.service';
import { InterestsService } from '../../../core/services/interests.service';
import { Notification } from '../../../core/models/notification';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface RidePost {
  id: string;
  origin: string;
  destination: string;
  travelDate: string;
  travelTime: string;
  availableSeats: number;
  status: 'ACTIVE' | 'COMPLETED';
}

interface InterestRequest {
  id: string;
  createdAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  user?: { name?: string; email?: string };
  post?: { origin?: string; destination?: string };
}

interface DashboardData {
  user?: { name?: string; email?: string };
  stats?: {
    totalPosts?: number;
    activePosts?: number;
    interestsSent?: number;
    interestsReceived?: number;
  };
  recentPosts: RidePost[];
  recentReceivedInterests: InterestRequest[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  private dashboardService = inject(DashboardService);
  private notificationService = inject(NotificationService);
  private interestsService = inject(InterestsService);
  private cdr = inject(ChangeDetectorRef);

  dashboard: DashboardData | null = null;
  loading = true;

  // --- Notifications state ---
  notifications: Notification[] = [];
  notificationsLoading = true;
  notificationsError = '';
  actionInProgress: Record<string, boolean> = {};
  actionedIds = new Set<string>();

  ngOnInit(): void {
    this.loadDashboard();
    this.loadNotifications();
  }

  loadDashboard(): void {
    this.loading = true;

    this.dashboardService.getDashboard().subscribe({
      next: (res: any) => {
        this.dashboard = {
          ...res,
          recentPosts: res?.recentPosts ?? [],
          recentReceivedInterests: res?.recentReceivedInterests ?? [],
        };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Dashboard Error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- Notification logic (moved in from Notifications component) ---

  loadNotifications(): void {
    this.notificationsLoading = true;
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.notificationsLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationsError = 'Failed to load notifications';
        this.notificationsLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  markAsRead(notification: Notification): void {
    if (notification.isRead) return;

    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;
        this.cdr.detectChanges();
      },
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach((n) => (n.isRead = true));
        this.cdr.detectChanges();
      },
    });
  }

  deleteNotification(notification: Notification, event: Event): void {
    event.stopPropagation();

    this.notificationService.deleteNotification(notification.id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(
          (n) => n.id !== notification.id
        );
        this.cdr.detectChanges();
      },
    });
  }

  respondToInterest(
    notification: Notification,
    status: 'ACCEPTED' | 'REJECTED',
    event: Event,
  ): void {
    event.stopPropagation();

    if (!notification.referenceId) return;

    this.actionInProgress[notification.id] = true;

    this.interestsService
      .updateStatus(notification.referenceId, status)
      .subscribe({
        next: () => {
          this.actionedIds.add(notification.id);
          notification.isRead = true;
          this.actionInProgress[notification.id] = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.actionInProgress[notification.id] = false;
          this.notificationsError = 'Could not update the interest. Try again.';
          this.cdr.detectChanges();
        },
      });
  }

  showActionButtons(notification: Notification): boolean {
    return (
      notification.type === 'INTEREST_RECEIVED' &&
      !!notification.referenceId &&
      !this.actionedIds.has(notification.id)
    );
  }

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  iconFor(type: Notification['type']): string {
    switch (type) {
      case 'INTEREST_RECEIVED':
        return 'directions_car';
      case 'INTEREST_ACCEPTED':
        return 'group';
      case 'POST_UPDATED':
        return 'directions_car';
      case 'POST_COMPLETED':
        return 'check_circle';
      case 'INTEREST_REJECTED':
        return 'directions_car';
      default:
        return 'notifications';
    }
  }

  colorFor(type: Notification['type']): string {
    switch (type) {
      case 'INTEREST_RECEIVED':
        return 'green';
      case 'INTEREST_ACCEPTED':
        return 'orange';
      case 'POST_UPDATED':
      case 'POST_COMPLETED':
        return 'blue';
      case 'INTEREST_REJECTED':
        return 'red';
      default:
        return 'blue';
    }
  }

  timeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  }
}