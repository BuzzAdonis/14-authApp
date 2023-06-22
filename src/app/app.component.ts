import { Router } from '@angular/router';
import { AuthStatus } from './auth/enumeration';
import { AuthService } from './auth/services/auth.service';
import { Component, computed, effect, inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private authService = inject( AuthService );
  private router = inject( Router );

  public finishedAuthCheck = computed<boolean>( () => {
    switch(this.authService.authStatus()){
      case AuthStatus.checking:
        return false;
      default:
        return true;
    }
  });

  public authStatusChangedEffect = effect(() =>{
    switch(this.authService.authStatus()){
      case AuthStatus.checking:
        return;
      case AuthStatus.notAuthticated:
        return this.router.navigateByUrl('/auth/login');
      default:
        return this.router.navigateByUrl('/dashboar');
    }
  });
}
