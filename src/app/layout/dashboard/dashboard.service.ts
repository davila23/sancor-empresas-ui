import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class DashboardService {

	constructor() {
		this.onSidenavToggle.subscribe((open = null) => {
			if (open === null) {
				this.isSnavOpened = !this.isSnavOpened;
			} else {
				this.isSnavOpened = open;
			}
		});
	}

	isSnavOpened = false;

	onSidenavToggle: EventEmitter<any> = new EventEmitter<any>();

}
