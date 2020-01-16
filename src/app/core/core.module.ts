import { NgModule } from '@angular/core';
import { LoginInterceptor } from './login.interceptor';
import { HTTP_INTERCEPTORS, HttpUrlEncodingCodec, HttpClientModule } from '@angular/common/http';
import { HttpService } from '@app/core/http.service';
import { UtilService } from '@app/core/util.service';
import { FocusService } from '@app/core/focus.service';
import { AuthService } from './auth.service';

@NgModule({
	declarations: [
	],
	imports: [
		HttpClientModule
	],
	providers: [
		HttpService,
		UtilService,
		FocusService,
		AuthService,
		HttpUrlEncodingCodec,
	 	{ provide: HTTP_INTERCEPTORS, useClass: LoginInterceptor, multi: true }		
		
	]
})
export class CoreModule { }
