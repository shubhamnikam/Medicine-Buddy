import { Injectable, OnInit } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, OnInit {
  constructor(private router: Router, private authService: AuthService)
  {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isUserStillAuthenticated()) {
      console.error(
        'Access denied. Navigating to Login...',
        'Auth error'
      );
      this.router.navigate(['/auth']);
      return false;
    }
    else {
      return true;
    }
  }

  ngOnInit()
  {
    this.authService.logoutUserRequest();
  }



}
