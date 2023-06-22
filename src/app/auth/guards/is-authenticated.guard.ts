import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../enumeration';

export const  isAuthenticatedGuard: CanActivateFn = (route, state) => {
  // const url = state.url;
  // localStorage.setItem('url', url);
  const authService = inject( AuthService );
  const router = inject( Router );
  const resul  = authService.authStatus() === AuthStatus.authnticated ;
  if (resul) return resul;
  if (authService.authStatus() === AuthStatus.checking) return resul;
  router.navigateByUrl('/auth/login');
  return resul;
};