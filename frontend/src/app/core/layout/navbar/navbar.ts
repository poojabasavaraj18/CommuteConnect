import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NotificationService } from '../../services/notification.service';
 
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatSidenavModule,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
 
  private router = inject(Router);
  private notificationService = inject(NotificationService);
 
  unreadCount = 0;
 
  ngOnInit(): void {
    this.loadUnreadCount();
  }
 
  loadUnreadCount(): void {
    this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        this.unreadCount = notifications.filter((n) => !n.isRead).length;
      },
      error: () => {
        // fail silently — badge just won't show
      },
    });
  }
 
  goToNotifications(): void {
    this.router.navigate(['/notifications']);
  }
 
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
 