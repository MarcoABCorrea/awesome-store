import {Component} from '@angular/core';
import {AuthService} from "../../auth.service";
import LoggedUser from "../../models/logged-user.model";
import {default as swal} from "sweetalert2";

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

	constructor(private authService: AuthService) {
	}

	signin() {
		if (!this.login.username) {
			swal('Atenção', 'Informe um e-mail para fazer login.', 'warning');
		} else if (!this.login.password) {
			swal('Atenção', 'Informe uma senha para fazer login.', 'warning');
		} else {
			this.authService.sendCredentials(this.login.username, this.login.password)
				.subscribe(success => {
					const token = success.json().token;
					const user: LoggedUser = new LoggedUser(this.login.username, token);
					this.authService.setLoggedUser(user);
					location.href = '/home';
				}, error => {
					if (error.status === 401) {
						swal('Acesso negado!', 'Login e/ou senha inválidos. Tente novamente.', 'error');
					}
				});
		}
	}
}
