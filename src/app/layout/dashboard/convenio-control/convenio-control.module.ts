import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvenioDetalleComponent } from './convenio-detalle/convenio-detalle.component';
import { DatosGeneralesComponent } from './convenio-detalle/datos-generales/datos-generales.component';
import { ContactoComponent } from './convenio-detalle/contacto/contacto.component';
import { ReferentesComponent } from './convenio-detalle/referentes/referentes.component';
import { GrillasComponent } from './convenio-detalle/grillas/grillas.component';
import { PlanesConvenidosComponent } from './convenio-detalle/planes-convenidos/planes-convenidos.component';
import { SubsidiosComponent } from './convenio-detalle/subsidios/subsidios.component';
import { FormaPagoComponent } from './convenio-detalle/forma-pago/forma-pago.component';
import { EntidadesComponent } from './convenio-detalle/entidades/entidades.component';
import { SucursalesComponent } from './convenio-detalle/sucursales/sucursales.component';
import { VipComponent } from './convenio-detalle/vip/vip.component';
import { ArchivosComponent } from './convenio-detalle/archivos/archivos.component';
import { SharedModule } from '@app/shared';
import { FormsModule } from '@angular/forms';
import { VipService } from '@app/services/empresa/convenios/alta-wizard/componentes/vip.service';
import { EmpresaService } from '@app/services/empresa/empresa.service';
import { ArchivosService } from '@app/services/empresa/convenios/alta-wizard/componentes/archivos.service';
import { ContactoService } from '@app/services/empresa/convenios/alta-wizard/componentes/contacto.service';
import { SucursalesService } from '@app/services/empresa/convenios/alta-wizard/componentes/sucursales.service';
import { SubsidiosService } from '@app/services/empresa/convenios/alta-wizard/componentes/subsidios.service';
import { ReferenteEmpresaService } from '@app/services/empresa/convenios/alta-wizard/componentes/referente-empresa.service';
import { PlanesConvenidosService } from '@app/services/empresa/convenios/alta-wizard/componentes/planes-convenidos.service';
import { FormasDePagoService } from '@app/services/empresa/convenios/alta-wizard/componentes/formas-de-pago.service';
import { GrillaEmpresaService } from '@app/services/empresa/convenios/alta-wizard/componentes/grilla-empresa.service';
import { EntidadesService } from '@app/services/empresa/convenios/alta-wizard/componentes/entidades.service';
import { DatosImpositivosService } from '@app/services/empresa/convenios/alta-wizard/componentes/datos-impositivos.service';
import { DatosGeneralesService } from '@app/services/empresa/convenios/alta-wizard/componentes/datos-generales.service';
import { CorrespondenciaService } from '@app/services/empresa/convenios/alta-wizard/componentes/correspondencia.service';
import { ConvenioTemporalService } from '@app/services/convenio-temporal/convenio-temporal.service';
import { DetalleFormaPagoModalComponent } from './convenio-detalle/forma-pago/detalle-forma-pago-modal/detalle-forma-pago-modal.component';
import { ConvenioListadoComponent } from './convenio-listado/convenio-listado.component';
import { ConvenioControlRoutingModule } from './convenio-control-routing.module';
import { ControlConvenioService } from '@app/services/control/control-convenio.service';

@NgModule({
  declarations: [
    ConvenioDetalleComponent, 
    DatosGeneralesComponent, 
    ContactoComponent, 
    ReferentesComponent, 
    GrillasComponent, 
    PlanesConvenidosComponent, 
    SubsidiosComponent, 
    FormaPagoComponent, 
    EntidadesComponent, 
    SucursalesComponent, 
    VipComponent, 
    ArchivosComponent,
    DetalleFormaPagoModalComponent,
    ConvenioListadoComponent
  ],
  imports: [
    ConvenioControlRoutingModule,
    SharedModule,
		FormsModule,
    CommonModule
  ],
  exports: [],
  providers: [ 
    ConvenioTemporalService,
    ControlConvenioService,
		/* Components services */
		CorrespondenciaService,
		DatosGeneralesService,
		DatosImpositivosService,
		EntidadesService,
		FormasDePagoService,
		GrillaEmpresaService,
		PlanesConvenidosService,
		ReferenteEmpresaService,
		SubsidiosService,
		SucursalesService,
		ContactoService,
		ArchivosService,
		EmpresaService,
		VipService
	],
	entryComponents: [
		DetalleFormaPagoModalComponent
	]
})
export class ConvenioControlModule { }
 