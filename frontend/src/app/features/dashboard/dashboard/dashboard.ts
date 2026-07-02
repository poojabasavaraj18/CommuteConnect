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

  dashboard: any;

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (res) => {
        this.dashboard = res;
      },
      error: (err) => {
        console.error('Dashboard Error:', err);
      },
    });
  }
}