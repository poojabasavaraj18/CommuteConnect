import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  dashboard: any = null;

  loading = true;

  ngOnInit(): void {

    console.log('Dashboard Loaded');

    this.loading = true;

    this.dashboardService.getDashboard().subscribe({

      next: (res) => {

        console.log('Dashboard Response:', res);

        this.dashboard = { ...res };

        this.loading = false;

        console.log('Loading:', this.loading);

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