import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectormesComponent } from './selectormes.component';
import {
	MatButtonToggleModule, MatButtonModule
} from '@angular/material';

@NgModule({
	declarations: [
		SelectormesComponent
	],
	imports: [
		CommonModule,
		MatButtonToggleModule,
		MatButtonModule
	],
	exports: [
		SelectormesComponent
	]
})
export class SelectormesModule { }
