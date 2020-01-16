import { RouterModule, Routes } from '@angular/router';
import { ListConvenioTemporalComponent } from './list-convenio-temporal/list-convenio-temporal.component';
import { NgModule } from '@angular/core';
import { AltaWizardConvenioComponent } from './alta-wizard-convenio/alta-wizard-convenio.component';
import { CheckEmpresaGuard } from '../empresa/guards/check-empresa.guard';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'listado'
	},
	{
		path: 'listado',
		component: ListConvenioTemporalComponent
	},
	{
		path: 'empresa/:empresaId/alta',
		component: AltaWizardConvenioComponent
		//canActivate: [CheckEmpresaGuard]
	},
	{
		path: 'empresa/:empresaId/edicion/:convenioId',
		component: AltaWizardConvenioComponent
	}
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ConvenioTemporalRoutingModule { }