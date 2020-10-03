import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsGuard } from '@app/guards/permissions.guard';
import { ALL } from '@app/models/permissions/roles';
import { ListControlConvenioComponent } from './list-convenio-control/list-control-convenio.component';

const routes: Routes = [
	{
        path: 'listado',
		component: ListControlConvenioComponent,
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
export class ControlConvenioRoutingModule {}