import {Component, OnInit, ViewChildren, QueryList} from '@angular/core';
import * as _ from 'lodash';
import {PageViewService} from '../../page-view/page-view.service';
import {PurchaseService} from '../../purchase/purchase.service';
import {Utils} from '../../shared/utils';
import * as moment from 'moment';
import {BaseChartDirective} from 'ng2-charts';
import {default as swal} from 'sweetalert2';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	providers: [PageViewService, PurchaseService]
})
export class DashboardComponent implements OnInit {

	@ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;
	protected burnDownChart: BaseChartDirective;
	protected chartColors = Utils.getColorsOptions();

	// Checkout
	protected checkoutData: number[] = [];
	protected checkoutLabels: string[] = [];

	// Purchase
	showChart = false;
	protected deviceData: number[] = [];
	protected deviceLabels: string[] = [];
	protected burnDownData: Array<any> = [];
	protected burnDownLabels: string[] = [];
	protected chartOptions = Utils.getChartOptions();

	constructor(private pageViewService: PageViewService,
				private purchaseService: PurchaseService) {
		moment.locale('pt-br');
		this.getCheckoutChartData();
		this.getLast30DaysPurchases();
		this.getBurnDownChartData();
	}

	ngOnInit() {

	}

	getCheckoutChartData() {
		this.pageViewService.getAllPageViews().subscribe(
			(response) => {
				// const data = {};

				// for (const pageView of response) {
				// 	if (data[pageView.page]) {
				// 		if (pageView.pageType === 'purchase') {
				// 			data[pageView.page].purchase = data[pageView.page].purchase + 1;
				// 		} else {
				// 			data[pageView.page].checkout = data[pageView.page].checkout + 1;
				// 		}
				// 	} else {
				// 		data[pageView.page] = {
				// 			purchase: 0,
				// 			checkout: 0
				// 		};
				// 	}
				// }

				const pageTypes = _.countBy(response, 'pageType');

				// _.mapKeys(data, (value, key) => {
				// 	this.checkoutLabels.push(key);
				// 	this.checkoutData.push(value.checkout / value.purchase);
				// });

				// _.mapKeys(pageTypes, (value, key) => {
				// 	this.checkoutLabels.push(key);
				// 	this.checkoutData.push(value.checkout / value.purchase);
				// });

				// ['purchase', 'checkout'].map(label => {
				// 	this.checkoutLabels.push(label);
				// });

				_.keys(pageTypes).map((label) => {
					this.checkoutLabels.push(_.capitalize(label));
				});

				this.checkoutData = _.values(pageTypes);
			},
			(error) => {
				console.error(error);
			}
		);
	}

	getLast30DaysPurchases() {
		const today = moment().valueOf();
		const last30days = moment(today).subtract(30, 'day').valueOf();
		this.purchaseService.getPurchasesByPeriod(last30days, today).subscribe(
			(response) => {
				const devices = _.countBy(response, 'device');

				_.keys(devices).map((label) => {
					this.deviceLabels.push(_.capitalize(label));
				});

				this.deviceData = _.values(devices);
			}, () => {
				swal('Erro!', 'Ocorreu um erro ao retornar Vendas!', 'error');
			});
	}

	getBurnDownChartData() {
		const thisMonth = moment().startOf('month');
		const referenceMonth = moment(thisMonth).subtract(2, 'month');

		this.purchaseService.getPurchasesByPeriod(referenceMonth.valueOf()).subscribe(
			(response) => {

				for (let i = 2; i >= 0; i--) {
					this.burnDownLabels.push(_.capitalize(moment(thisMonth).subtract(i, 'month').format('MMMM')));
				}

				const data = {};

				for (const purchase of response) {
					const date = moment(purchase.datetime).format('MM');

					if (!data[purchase.device]) {
						data[purchase.device] = {first: 0, second: 0, third: 0};
					}

					if (date === referenceMonth.format('MM')) {
						data[purchase.device].first++;
					} else if (date === moment(thisMonth).subtract(1, 'month').format('MM')) {
						data[purchase.device].second++;
					} else if (date === thisMonth.format('MM')) {
						data[purchase.device].third++;
					}
				}

				_.keys(data).map((device, i) => {
					this.burnDownData[i] = {data: _.values(data[device]), label: _.capitalize(device)};
				});

				this.showChart = true;
			}, () => {
				swal('Erro!', 'Ocorreu um erro ao retornar Vendas por período!', 'error');
			});
	}
}
