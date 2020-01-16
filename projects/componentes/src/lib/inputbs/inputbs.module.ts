import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputBSComponent } from './inputbs.component';
import { FormsModule } from '@angular/forms';
import {
	MatBottomSheetModule,
	MatFormFieldModule,
	MatInputModule,
} from '@angular/material';
import { AutocompleteModule } from '../autocomplete';
import { FechaModule } from '../fecha';
import { ComponentesService } from '../componentes.service';

@NgModule({
	declarations: [
		InputBSComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		MatBottomSheetModule,
		MatFormFieldModule,
		MatInputModule,
		AutocompleteModule,
		FechaModule
	],
	exports: [
		InputBSComponent
	],
	entryComponents: [
		InputBSComponent
	],
	providers: [
		ComponentesService
	]
})
export class InputBSModule { }
