import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionsGuard } from '@app/guards/permissions.guard';
import { ALL } from '@app/models/permissions/roles';
import { ReporteConveniosComponent } from './reporte-convenios/reporte-convenios.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'convenios'
	},
	{
		path: 'convenios',
		component: ReporteConveniosComponent,
		canActivate: [PermissionsGuard],
		data: {
			roles: ALL
		}
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ReportesRoutingModule { }
