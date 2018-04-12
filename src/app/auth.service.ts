import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {environment} from "../environments/environment";
import LoggedUser from "./models/logged-user.model";

@Injectable()
export class AuthService {

	email: string;
	password: string;

	constructor(private http: Http, private router: Router) {
	}

	sendCredentials(email: string, password: string): Observable<any> {

		this.email = email;
		this.password = password;

		return this.http.post(`${environment.api}/auth/login`, {
			'email': email,
			'password': password
		});

	}

	getLoggedUser(): LoggedUser {
		const awesomeUser: string = localStorage.getItem('awesomeUser');
		return <LoggedUser> JSON.parse(awesomeUser);
	}

	setLoggedUser(loggedUser: LoggedUser) {
		localStorage.setItem('awesomeUser', JSON.stringify(loggedUser));
	}

	removeLoggedUser() {
		localStorage.removeItem('awesomeUser');
	}

}
