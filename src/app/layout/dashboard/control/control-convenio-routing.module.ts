import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListControlConvenioComponent } from './list-convenio-control/list-control-convenio.component';

const routes: Routes = [
	{
        path: 'listado',
		component: ListControlConvenioComponent
	}
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ControlConvenioRoutingModule {}