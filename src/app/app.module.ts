import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { SharedModule } from './shared';
import { LoginComponent } from './layout/login';
import { NotFoundComponent } from './layout/not-found/not-found.component';
import { AuthenticationService } from './services/authentication.service';
import { DataTransferService } from './services/common/data-transfer.service';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		NotFoundComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		CoreModule,
		SharedModule,
	],
	providers: [
		AuthenticationService,
		DataTransferService
	],
	bootstrap: [AppComponent]
	
})
export class AppModule { }
