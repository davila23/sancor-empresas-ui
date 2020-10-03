import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from '@tres-erres/ngx-utils';

/* Material Modules */
import {
	MatButtonModule,
	MatInputModule,
	MatCardModule,
	MatProgressSpinnerModule,
	MatTooltipModule,
	MatSnackBarModule,
	MatDialogModule,
	MatToolbarModule,
	MatIconModule,
	MatCheckboxModule,
	MatSelectModule,
	MatTableModule,
	MatFormFieldModule,
	MatRadioModule,
	MatSidenavModule,
	MatListModule,
	MatMenuModule,
	MatRippleModule,
	MatPaginatorModule,
	MatChipsModule,
	MatBadgeModule,
	MatSortModule,
	MatExpansionModule,
	MatStepperModule,
	MatAutocompleteModule,
	MatProgressBarModule,
	MatDatepickerModule,
} from '@angular/material';
/** Modules */
import { ComponentesModule, HttpService as ComponentesHttpService } from '@componentes/.';

/** Directives */
import { FocusNextDirective } from './focus-next.directive';
import { ButtonComponent } from './button/button.component';
import { HttpService } from '@app/core';

import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from './dialogs/dialog.component';
import { SuccessComponent } from './snackbar/success/success.component';
import { ErrorComponent } from './snackbar/error/error.component';
import { InformationComponent } from './snackbar/information/information.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { AlertComponent } from './alert/alert.component';
import { AutocompleteModule } from './autocomplete';
import { LoadingDirective } from './loading.directive';
import { LoadingComponent } from './loading/loading.component';
import { RetryingComponent } from './snackbar/retrying/retrying.component';
import { TelefonoInputComponent } from './telefono-input/telefono-input.component';
import { ContextMenuComponent } from '@app/layout/dashboard/empresa/empresa/context-menu.component';
import { AuthInterceptor } from '@app/http-interceptors/auth-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DetalleFormaPagoModalComponent } from './detalle-forma-pago-modal/detalle-forma-pago-modal.component';
import { UppercaseInputDirective } from './uppercase-input.directive';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,

		/* Custom Modules */
		ComponentesModule,

		/* Material Modules */
		MatAutocompleteModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
		MatCardModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatDialogModule,
		MatToolbarModule,
		MatIconModule,
		MatCheckboxModule,
		MatSelectModule,
		MatRadioModule,
		MatSidenavModule,
		MatListModule,
		MatMenuModule,
		MatRippleModule,
		MatPaginatorModule,
		MatTableModule,
		MatSortModule,
		MatExpansionModule,
		MatStepperModule,
		MatProgressBarModule,
		MatAutocompleteModule,
		MatProgressBarModule,
		MatDatepickerModule,

		UtilsModule
	],
	declarations: [
		/* Directives */
		FocusNextDirective,
		ButtonComponent,
		ConfirmDialogComponent,
		DialogComponent,
		SuccessComponent,
		ErrorComponent,
		InformationComponent,
		BreadcrumbsComponent,
		AlertComponent,
		LoadingDirective,
		LoadingComponent,
		RetryingComponent,
		TelefonoInputComponent,
		ContextMenuComponent,
		DetalleFormaPagoModalComponent,
		UppercaseInputDirective
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,

		/* Custom Modules */
		ComponentesModule,
		UtilsModule,
		ButtonComponent,
		BreadcrumbsComponent,
		AlertComponent,

		/* Material Modules */
		MatAutocompleteModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
		MatCardModule,
		MatProgressSpinnerModule,
		MatTooltipModule,
		MatSnackBarModule,
		MatDialogModule,
		MatToolbarModule,
		MatIconModule,
		MatCheckboxModule,
		MatSelectModule,
		MatTableModule,
		MatRadioModule,
		MatSidenavModule,
		MatListModule,
		MatMenuModule,
		MatRippleModule,
		MatPaginatorModule,
		MatTableModule,
		MatChipsModule,
		MatBadgeModule,
		MatSortModule,
		MatExpansionModule,
		MatStepperModule,
		MatAutocompleteModule,
		MatProgressBarModule,
		MatDatepickerModule,
		/** Directives */
		FocusNextDirective,
		LoadingDirective,

		ConfirmDialogComponent,
		DialogComponent,
		SuccessComponent,
		ErrorComponent,
		InformationComponent,
		RetryingComponent,
		AutocompleteModule,
		TelefonoInputComponent,
		ContextMenuComponent,
		DetalleFormaPagoModalComponent,
		UppercaseInputDirective

	],
	providers: [
		{ provide: ComponentesHttpService, useExisting: HttpService },
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
	],
	entryComponents: [
		ConfirmDialogComponent,
		DialogComponent,
		SuccessComponent,
		ErrorComponent,
		InformationComponent,
		RetryingComponent,
		LoadingComponent,
		ContextMenuComponent,
		DetalleFormaPagoModalComponent
	]
})
export class SharedModule { }
