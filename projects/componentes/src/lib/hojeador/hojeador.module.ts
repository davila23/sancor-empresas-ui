import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HojeadorComponent } from './hojeador.component';
import { MatPaginatorIntlEs } from './paginator-translation';
import {
	MatTableModule,
	MatPaginatorModule,
	MatSortModule,
	MatPaginatorIntl,
	MatCheckboxModule,
	MatSlideToggleModule,
	MatMenuModule,
	MatFormFieldModule,
	MatProgressSpinnerModule,
	MatBottomSheetModule,
	MatInputModule,
	MatButtonModule,
	MatSnackBarModule,
	MatTooltipModule,
	MatIconModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ComponentesService } from '../componentes.service';
import { NumformPipe } from '@tres-erres/ngx-utils';
import { CheckboxComponent } from './componentes';

@NgModule({
	declarations: [
		HojeadorComponent,
		CheckboxComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatSlideToggleModule,
		MatMenuModule,
		MatFormFieldModule,
		MatProgressSpinnerModule,
		MatBottomSheetModule,
		MatInputModule,
		MatButtonModule,
		MatSnackBarModule,
		MatIconModule,
		MatTooltipModule
	],
	providers: [
		{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlEs },
		ComponentesService,
		NumformPipe
	],
	exports: [
		HojeadorComponent,
		CheckboxComponent
	]
})
export class HojeadorModule { }
