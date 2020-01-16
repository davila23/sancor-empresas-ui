import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewEmpresaComponent } from './new-empresa/new-empresa.component';
import { EmpresaComponent } from './empresa/empresa.component';
import { ViewEmpresaComponent } from './view-empresa/view-empresa.component';
import { CheckEmpresaGuard } from './guards/check-empresa.guard';
import { EditEmpresaComponent } from './edit-empresa/edit-empresa.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'busqueda',
		pathMatch: 'full',
	},
	{
		path: 'nueva',
		component: NewEmpresaComponent
	},
	{
		path: ':empresaId/editar',
		component: EditEmpresaComponent,
		canActivate: [CheckEmpresaGuard]
	},
	{
		path: 'busqueda',
		component: EmpresaComponent
	},
	{
		path: ':empresaId',
		redirectTo: ':empresaId/ver'
	},
	{
		path: ':empresaId/ver',
		component: ViewEmpresaComponent,
		canActivate: [CheckEmpresaGuard]
	}
];
@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EmpresaRoutingModule { }
