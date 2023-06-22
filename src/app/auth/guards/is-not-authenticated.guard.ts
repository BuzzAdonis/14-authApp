import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../enumeration';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject( AuthService );
  const router = inject( Router );
  const resul  = !(authService.authStatus() === AuthStatus.authnticated) ;
  if (resul) return resul;
  router.navigateByUrl('/dashboar');
  return resul;
};
