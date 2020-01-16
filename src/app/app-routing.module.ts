import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './layout/login';
import { NotFoundComponent } from './layout/not-found/not-found.component';

const routes: Routes = [
	{
		path: '',
		canActivate: [AuthGuard],
		loadChildren: 'app/layout/dashboard/dashboard.module#DashboardModule'
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: '404',
		component: NotFoundComponent
	},
	{
		path: '**',
		redirectTo: '404'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
