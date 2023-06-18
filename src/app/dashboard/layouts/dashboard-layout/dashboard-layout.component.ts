import { Component, inject, computed } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})

export class DashboardLayoutComponent {

  private authService = inject(AuthService);

  public user = this.authService.currentUser;

  public logout () {
    this.authService.logout();
  }

}
