import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ControlConvenioRoutingModule } from './control-convenio-routing.module';
import { ListControlConvenioComponent } from './list-convenio-control/list-control-convenio.component';
import { ControlConvenioService } from '@app/services/control/control-convenio.service';

@NgModule({
	declarations: [
        ListControlConvenioComponent
	],
	imports: [
		ControlConvenioRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		FormsModule,
		CommonModule,
		HttpModule
	],
	exports: [ ],
	providers: [
		ControlConvenioService
	]
})
export class ControlConvenioModule{}