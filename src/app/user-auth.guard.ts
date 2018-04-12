import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "./auth.service";


@Injectable()
export class UserAuthGuard implements CanActivate {
	constructor(private router: Router, private authService: AuthService) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (!this.authService.getLoggedUser() && route.routeConfig.path !== 'login') {
			this.router.navigate(['login']);
			return false;
		}

		if (this.authService.getLoggedUser() && route.routeConfig.path === 'login') {
			this.router.navigate(['']);
		}

		return true;
	}
}
