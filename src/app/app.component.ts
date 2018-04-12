import {Component, OnInit} from '@angular/core';
import LoggedUser from "./models/logged-user.model";
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	private loggedUser: LoggedUser = new LoggedUser();

	ngOnInit() {
		this.loggedUser = this.authService.getLoggedUser();
	}

	constructor(private router: Router,
				private authService: AuthService) {
	}

	public hasLoggedUser() {
		return this.loggedUser && this.loggedUser.name !== '' && this.loggedUser.token !== '';
	}

	public logout() {
		this.router.navigate(['login']);
		this.authService.removeLoggedUser();
		this.loggedUser = null;
	}
}
