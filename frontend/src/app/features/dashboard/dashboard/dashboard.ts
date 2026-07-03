import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
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
  private cdr = inject(ChangeDetectorRef);

  dashboard: DashboardData | null = null;
  loading = true;

  ngOnInit(): void {
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
}