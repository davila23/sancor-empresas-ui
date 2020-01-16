import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ABMTableComponent } from './abmtable.component';
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
	MatIconModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ComponentesService } from '../componentes.service';
import { NumformPipe } from '@tres-erres/ngx-utils';

@NgModule({
	declarations: [
		ABMTableComponent
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
		MatIconModule
	],
	providers: [
		{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlEs },
		ComponentesService,
		NumformPipe
	],
	exports: [
		ABMTableComponent
	]
})
export class ABMTableModule { }
