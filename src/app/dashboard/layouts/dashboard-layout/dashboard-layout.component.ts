import { AuthService } from './../../../auth/services/auth.service';
import { Component, computed, inject } from '@angular/core';

@Component({
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent {
  private authService = inject( AuthService );
  public user = computed(() => this.authService.currentUser() );

  // get user(){
  //   return this.authService.currentUser();
  // }
  onLogout(){
    this.authService.logout()
  }
}