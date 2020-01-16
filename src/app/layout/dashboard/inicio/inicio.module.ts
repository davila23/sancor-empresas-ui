import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './inicio.component';
import { SharedModule } from '@app/shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { ChartjsModule } from '@ctrl/ngx-chartjs';

@NgModule({
	declarations: [
		InicioComponent
	],
	imports: [
		CommonModule,
		InicioRoutingModule,
		SharedModule,
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyCD-Ju55k1kXOoOK9lB621AxV3weEyf4A4'
		}),
		ChartjsModule
	]
})
export class InicioModule { }
