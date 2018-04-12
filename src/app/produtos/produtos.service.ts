import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class ProdutosService {

	constructor(private httpClient: HttpClient) {
	}

	getAllProducts() {
		return this.httpClient.get(`${environment.api}/products`);
	}
}
