import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class PageViewService {

	constructor(private httpClient: HttpClient) {
	}

	getAllPageViews() {
		return this.httpClient.get(`${environment.api}/pageViews`);
	}
}
