import { ConvenioTemporalRoutingModule } from './convenio-temporal-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ListConvenioTemporalComponent } from './list-convenio-temporal/list-convenio-temporal.component';
import { ConvenioTemporalService } from '@app/services/convenio-temporal/convenio-temporal.service';
import { AltaWizardConvenioComponent } from './alta-wizard-convenio/alta-wizard-convenio.component';
import { DatosGeneralesComponent } from './alta-wizard-convenio/datos-generales/datos-generales.component';
import { ContactoComponent } from './alta-wizard-convenio/contacto/contacto.component';
import { CorrespondenciaComponent } from './alta-wizard-convenio/correspondencia/correspondencia.component';
import { DatosImpositivosComponent } from './alta-wizard-convenio/datos-impositivos/datos-impositivos.component';
import { EntidadesComponent } from './alta-wizard-convenio/entidades/entidades.component';
import { SucursalesComponent } from './alta-wizard-convenio/sucursales/sucursales.component';
import { ReferenteComponent } from './alta-wizard-convenio/referente/referente.component';
import { GrillasComponent } from './alta-wizard-convenio/grillas/grillas.component';
import { PlanesConvenidosComponent } from './alta-wizard-convenio/planes-convenidos/planes-convenidos.component';
import { SubsidiosComponent } from './alta-wizard-convenio/subsidios/subsidios.component';
import { FormasPagoComponent } from './alta-wizard-convenio/formas-pago/formas-pago.component';
import { ArchivosComponent } from './alta-wizard-convenio/archivos/archivos.component';
import { CorrespondenciaService } from '@app/services/empresa/convenios/alta-wizard/componentes/correspondencia.service';
import { DatosGeneralesService } from '@app/services/empresa/convenios/alta-wizard/componentes/datos-generales.service';
import { DatosImpositivosService } from '@app/services/empresa/convenios/alta-wizard/componentes/datos-impositivos.service';
import { EntidadesService } from '@app/services/empresa/convenios/alta-wizard/componentes/entidades.service';
import { FormasDePagoService } from '@app/services/empresa/convenios/alta-wizard/componentes/formas-de-pago.service';
import { GrillaEmpresaService } from '@app/services/empresa/convenios/alta-wizard/componentes/grilla-empresa.service';
import { PlanesConvenidosService } from '@app/services/empresa/convenios/alta-wizard/componentes/planes-convenidos.service';
import { ReferenteEmpresaService } from '@app/services/empresa/convenios/alta-wizard/componentes/referente-empresa.service';
import { SubsidiosService } from '@app/services/empresa/convenios/alta-wizard/componentes/subsidios.service';
import { SucursalesService } from '@app/services/empresa/convenios/alta-wizard/componentes/sucursales.service';
import { ContactoService } from '@app/services/empresa/convenios/alta-wizard/componentes/contacto.service';
import { ArchivosService } from '@app/services/empresa/convenios/alta-wizard/componentes/archivos.service';
import { EmpresaService } from '@app/services/empresa/empresa.service';
import { DetalleFormaPagoModalComponent } from './alta-wizard-convenio/formas-pago/detalle-forma-pago-modal/detalle-forma-pago-modal.component';
import { VipComponent } from './alta-wizard-convenio/vip/vip.component';
import { VipService } from '@app/services/empresa/convenios/alta-wizard/componentes/vip.service';
import { ControlConvenioService } from '@app/services/control/control-convenio.service';

@NgModule({
	declarations: [
		ListConvenioTemporalComponent,
		/* Components */
		AltaWizardConvenioComponent,
		DatosGeneralesComponent,
		ContactoComponent,
		CorrespondenciaComponent,
		DatosImpositivosComponent,
		EntidadesComponent,
		SucursalesComponent,
		ReferenteComponent,
		GrillasComponent,
		PlanesConvenidosComponent,
		SubsidiosComponent,
		FormasPagoComponent,
		ArchivosComponent,
		DetalleFormaPagoModalComponent,
		VipComponent
	],
	imports: [
		ConvenioTemporalRoutingModule,
		SharedModule,
		FormsModule,
		CommonModule
	],
	exports: [],
	providers: [ 
		ConvenioTemporalService,
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
		VipService,
		ControlConvenioService
	],
	entryComponents: [
		DetalleFormaPagoModalComponent
	]
})
export class ConvenioTemporalModule { }
