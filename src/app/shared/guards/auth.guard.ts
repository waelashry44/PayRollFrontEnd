import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router){}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) { 
    console.log('isUserAuthenticated',this.authService.isUserAuthenticated());
    if (this.authService.isUserAuthenticated() == true) {
      return true;
    }

    this.router.navigate(['/authentication/login'], { queryParams: { returnUrl: state.url }});
    return false;
  } 
}
