import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FechaComponent } from './fecha.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	MatDatepickerModule,
	MatNativeDateModule,
	MatFormFieldModule,
	MatInputModule,
	DateAdapter,
	MAT_DATE_LOCALE,
	MAT_DATE_FORMATS,
	MatIconModule,
	MatButtonModule
} from '@angular/material';

import { DayjsDateAdapter, DAYJS_DATE_FORMATS } from '../dayjs-date-adapter';

import { FechaDirective } from './fecha.directive';

@NgModule({
	declarations: [
		FechaComponent,
		FechaDirective,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule
	], providers: [
		{ provide: MAT_DATE_LOCALE, useValue: 'es' },
		{ provide: DateAdapter, useClass: DayjsDateAdapter, deps: [MAT_DATE_LOCALE] },
		{ provide: MAT_DATE_FORMATS, useValue: DAYJS_DATE_FORMATS },
	], exports: [
		FechaComponent
	]
})
export class FechaModule { }
