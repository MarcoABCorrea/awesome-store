import {Roles} from '../enum/roles.enum';

export default class LoggedUser {
	name: string;
	token: string;
	roles: Roles[];

	constructor(name = '', token = '', roles = []) {
		this.name = name;
		this.token = token;
		this.roles = roles;
	}
}
