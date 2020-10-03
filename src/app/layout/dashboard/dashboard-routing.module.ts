import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		children: [
			{
				path: '',
				redirectTo: 'empresa',
				pathMatch: 'full'
			},
			{
				path: 'empresa',
				loadChildren: 'app/layout/dashboard/empresa/empresa.module#EmpresaModule'
			},
			{
				path: 'conveniosdefinitivos',
				loadChildren: 'app/layout/dashboard/convenio-definitivo/convenio-definitivo.module#ConvenioDefinitivoModule'
			},
			{
				path: 'conveniostemporales',
				loadChildren: 'app/layout/dashboard/convenio-temporal/convenio-temporal.module#ConvenioTemporalModule'
			},
			{
				path: 'convenioscontrol',
				loadChildren: 'app/layout/dashboard/convenio-control/convenio-control.module#ConvenioControlModule'
			},
			{
				path: 'reportes',
				loadChildren: 'app/layout/dashboard/reportes/reportes.module#ReportesModule'
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DashboardRoutingModule { }
