import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { EmpresaComponent } from './empresa/empresa.component';
import { ItemEmpresaComponent } from './item-empresa/item-empresa.component';
import { ListEmpresaComponent } from './list-empresa/list-empresa.component';
import { NewEmpresaComponent } from './new-empresa/new-empresa.component';
import { EmpresaRoutingModule } from './empresa-routing.module';
import { SearchEmpresaComponent } from './search-empresa/search-empresa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditEmpresaComponent } from './edit-empresa/edit-empresa.component';
import { CommonModule } from '@angular/common';
import { ViewEmpresaComponent } from './view-empresa/view-empresa.component';
import { HttpModule } from '@angular/http';

// Services
import { EmpresaService } from '@app/services/empresa/empresa.service';
import { CondicionIvaService } from '@app/services/condicion-iva/condicion-iva.service';
import { ContactoService } from '@app/services/empresa/convenios/alta-wizard/componentes/contacto.service';

@NgModule({
		declarations: [
		EmpresaComponent,
		ItemEmpresaComponent,
		ListEmpresaComponent,
		NewEmpresaComponent,
		SearchEmpresaComponent,
		EditEmpresaComponent,
		ViewEmpresaComponent
	],
	imports: [
		EmpresaRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		FormsModule,
		CommonModule,
		HttpModule
	],
	exports: [ ],
	providers: [
		/* ABM Empresas */
		EmpresaService,
		CondicionIvaService,
		ContactoService
	]
})
export class EmpresaModule { }
