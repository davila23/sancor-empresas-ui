import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from './autocomplete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
	MatAutocompleteModule,
	MatFormFieldModule,
	MatIconModule,
	MatButtonModule,
	MatInputModule,
	MatChipsModule
} from '@angular/material';
import { ComponentesService } from '../componentes.service';

@NgModule({
	declarations: [
		AutocompleteComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatAutocompleteModule,
		MatFormFieldModule,
		MatIconModule,
		MatButtonModule,
		MatInputModule,
		MatChipsModule
	],
	exports: [
		AutocompleteComponent
	],
	providers: [
		ComponentesService
	]
})
export class AutocompleteModule { }
