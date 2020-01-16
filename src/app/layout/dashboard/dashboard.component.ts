import { Component, OnInit, HostListener } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { UtilService, HttpService } from '@app/core';
import { Router } from '@angular/router';


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	constructor(
		private dashboardService: DashboardService,
		private router: Router,
		private httpService: HttpService,
		private utilService: UtilService

	) { }

	ngOnInit() {
	}

	@HostListener('panright', ['$event'])
	openSidenav(ev) {
		if (ev.pointerType === 'touch' && ev.deltaX > -30 && ev.deltaX < 0) {
			this.dashboardService.onSidenavToggle.emit(true);
		}
	}

	@HostListener('panleft', ['$event'])
	closeSidenav(ev) {
		if (ev.pointerType === 'touch') {
			this.dashboardService.onSidenavToggle.emit(false);
		}
	}
}
