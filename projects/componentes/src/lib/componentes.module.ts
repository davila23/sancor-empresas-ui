import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Modules */
import { HojeadorModule } from './hojeador';
import { AutocompleteModule } from './autocomplete';
import { SelectormesModule } from './selectormes';
import { FechaModule } from './fecha';
import { ABMTableModule } from './abmtable';
import { InputBSModule } from './inputbs';

import { HttpService } from './http.service';
import { ComponentesService } from './componentes.service';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		HojeadorModule,
		InputBSModule,
		AutocompleteModule,
		SelectormesModule,
		FechaModule,

		ABMTableModule
	],
	exports: [
		HojeadorModule,
		InputBSModule,
		AutocompleteModule,
		SelectormesModule,
		FechaModule,
		ABMTableModule,

	],
	providers: [
		HttpService,
		ComponentesService
	]
})
export class ComponentesModule { }
