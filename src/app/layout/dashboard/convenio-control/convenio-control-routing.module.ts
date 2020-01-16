import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConvenioDetalleComponent } from './convenio-detalle/convenio-detalle.component';
import { ConvenioListadoComponent } from './convenio-listado/convenio-listado.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'listado',
		pathMatch: 'full'
	},
	{
		path: 'listado',
		component: ConvenioListadoComponent
	},
	{
		path: 'convenio/:convenioId',
		component: ConvenioDetalleComponent
	}
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ConvenioControlRoutingModule { }