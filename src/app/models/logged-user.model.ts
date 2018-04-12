export default class LoggedUser {
	name: string;
	token: string;

	constructor(name = '', token = '') {
		this.name = name;
		this.token = token;
	}
}
