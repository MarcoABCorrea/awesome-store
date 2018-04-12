import {Component, OnInit} from '@angular/core';
import {ProdutosService} from '../produtos.service';
import {Produto} from '../../models/produto.model';
import {default as swal} from 'sweetalert2';
import * as _ from 'lodash';
import {PaginationInstance} from 'ngx-pagination';

@Component({
	selector: 'app-produtos',
	templateUrl: './produtos.component.html',
	styleUrls: ['./produtos.component.scss'],
	providers: [ProdutosService]
})
export class ProdutosComponent implements OnInit {

	protected produtos: Produto[] = [];
	protected config: PaginationInstance = {
		id: 'custom',
		itemsPerPage: 10,
		currentPage: 1,
	};

	constructor(private produtosService: ProdutosService) {
		this.produtosService.getAllProducts().subscribe(
			(response) => {
				this.produtos = response as Produto[];
			},
			(error) => {
				swal('Erro!', 'Ocorreu um erro ao retornar Produtos!', 'error');
			});
	}

	ngOnInit() {
	}

	sortProducts(fieldname, order) {
		this.produtos = _.orderBy(this.produtos, [fieldname], [order]);
	}
}
