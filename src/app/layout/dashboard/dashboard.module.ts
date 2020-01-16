import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardComponent } from './dashboard.component';
import { SidenavComponent } from './componentes/sidenav/sidenav.component';
import { TopbarComponent } from './componentes/topbar/topbar.component';

import { DashboardService } from './dashboard.service';
import { ConvenioTemporalService } from '@app/services/convenio-temporal/convenio-temporal.service';


@NgModule({
	declarations: [
		DashboardComponent,
		SidenavComponent,
		TopbarComponent
	],
	imports: [
		CommonModule,
		DashboardRoutingModule,
		SharedModule,
	],
	providers: [
		DashboardService,
		ConvenioTemporalService
	]
})
export class DashboardModule { }
