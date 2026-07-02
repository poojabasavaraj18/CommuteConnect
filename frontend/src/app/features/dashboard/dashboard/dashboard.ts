import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  private dashboardService = inject(DashboardService);

  dashboard: any = null;

  loading = true;

  ngOnInit(): void {

    console.log('Dashboard Loaded');

    this.dashboardService.getDashboard().subscribe({

      next: (res) => {

        console.log('Dashboard Response:', res);

        this.dashboard = res;

        console.log('Dashboard Variable:', this.dashboard);

        this.loading = false;

        console.log('Loading:', this.loading);

      },

      error: (err) => {

        console.error('Dashboard Error:', err);

        this.loading = false;

      },

      complete: () => {

        console.log('Dashboard Request Completed');

      }

    });

  }

}