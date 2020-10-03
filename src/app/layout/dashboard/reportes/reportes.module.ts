import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteConveniosComponent } from './reporte-convenios/reporte-convenios.component';
import { ReportesRoutingModule } from './reportes-routing.module';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [ReporteConveniosComponent],
  imports: [
    CommonModule,
		ReportesRoutingModule,
		SharedModule
  ]
})
export class ReportesModule { }
