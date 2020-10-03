import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ConvenioDetalleComponent } from './convenio-detalle/convenio-detalle.component';
import { ConvenioListadoComponent } from './convenio-listado/convenio-listado.component';
import { PermissionsGuard } from '@app/guards/permissions.guard';
import { ALL } from '@app/models/permissions/roles';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'listado',
		pathMatch: 'full'
	},
	{
		path: 'listado',
		component: ConvenioListadoComponent,
		canActivate: [PermissionsGuard],
        data: {
			roles: ALL
        }
	},
	{
		path: 'convenio/:convenioId',
		component: ConvenioDetalleComponent,
		canActivate: [PermissionsGuard],
        data: {
			roles: ALL
        }
	}
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ConvenioControlRoutingModule { }