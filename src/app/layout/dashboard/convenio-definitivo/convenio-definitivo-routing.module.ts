import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListConvenioDefinitivoComponent } from './list-convenio-definitivo/list-convenio-definitivo.component';
import { DetallesEdicionComponent } from './detalles-edicion/detalles-edicion.component';
import { CheckEmpresaGuard } from '../empresa/guards/check-empresa.guard';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'listado'
	},
	{
		path: 'listado',
		component: ListConvenioDefinitivoComponent
	},
	{
		path: 'empresa/:empresaId',
		component: ListConvenioDefinitivoComponent
	},
	{
		path: 'empresa/:empresaId/detalles/:convenioId',
		component: DetallesEdicionComponent
	}
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ConvenioDefinitivoRoutingModule { }