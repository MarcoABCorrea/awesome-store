import {Component} from '@angular/core';
import {AuthService} from "../../auth.service";
import LoggedUser from "../../models/logged-user.model";
import {default as swal} from "sweetalert2";
import {environment} from "../../../environments/environment";
import {Headers, Http} from "@angular/http";

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	providers: [AuthService]
})
export class LoginComponent {

	protected login = {
		username: null,
		password: null
	};

	constructor(private authService: AuthService, private http: Http) {
	}

	signin() {
		if (!this.login.username) {
			swal('Atenção', 'Informe um e-mail para fazer login.', 'warning');
		} else if (!this.login.password) {
			swal('Atenção', 'Informe uma senha para fazer login.', 'warning');
		} else {
			this.authService.sendCredentials(this.login.username, this.login.password)
				.subscribe(success => {
					this.getCompleteUser(success.json().token);
				}, error => {
					if (error.status === 401) {
						swal('Acesso negado!', 'Login e/ou senha inválidos. Tente novamente.', 'error');
					}
				});
		}
	}

	/**
	 * Purpose: Recupera o objeto usuário utilizando o email e salva os dados deste no localStorage
	 * @param {string} token
	 */
	getCompleteUser(token: string) {
		let header: Headers = new Headers();
		header.append('Authorization', 'Bearer ' + token);
		this.http.get(`${environment.api}/users?email=${this.login.username}`, {
			headers: header
		}).subscribe(success => {
			const user: any = success.json()[0];
			const logged: LoggedUser = new LoggedUser(user.name, token, user.roles);
			this.authService.setLoggedUser(logged);
			location.href = '/home';
		})
	}
}
