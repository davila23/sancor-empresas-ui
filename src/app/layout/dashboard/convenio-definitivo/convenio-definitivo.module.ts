import { ConvenioDefinitivoRoutingModule } from './convenio-definitivo-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ListConvenioDefinitivoComponent } from './list-convenio-definitivo/list-convenio-definitivo.component';
import { DetallesEdicionComponent } from './detalles-edicion/detalles-edicion.component';

import { ConvenioDefinitivoService } from '@app/services/convenio-definitivo/convenio-definitivo.service';
import { DatosGeneralesService } from '@app/services/empresa/convenios/alta-wizard/componentes/datos-generales.service';
import { ArchivosService } from '@app/services/empresa/convenios/alta-wizard/componentes/archivos.service';

// componentes
import { DetalleReferenteComponent } from './detalles-edicion/detalle-referente/detalle-referente.component';
import { DetalleGrillasComponent } from './detalles-edicion/detalle-grillas/detalle-grillas.component';
import { DetallePlanesConvenidosComponent } from './detalles-edicion/detalle-planes-convenidos/detalle-planes-convenidos.component';
import { DetalleSubsidiosComponent } from './detalles-edicion/detalle-subsidios/detalle-subsidios.component';
import { DetalleFormasPagoComponent } from './detalles-edicion/detalle-formas-pago/detalle-formas-pago.component';
import { DetalleEntidadesComponent } from './detalles-edicion/detalle-entidades/detalle-entidades.component';
import { DetalleSucursalesComponent } from './detalles-edicion/detalle-sucursales/detalle-sucursales.component';
import { DetalleDatosImpositivosComponent } from './detalles-edicion/detalle-datos-impositivos/detalle-datos-impositivos.component';
import { DetalleCorrespondenciaComponent } from './detalles-edicion/detalle-correspondencia/detalle-correspondencia.component';
import { EmpresaService } from '@app/services/empresa/empresa.service';
import { CorrespondenciaService } from '@app/services/empresa/convenios/alta-wizard/componentes/correspondencia.service';
import { DatosImpositivosService } from '@app/services/empresa/convenios/alta-wizard/componentes/datos-impositivos.service';
import { EntidadesService } from '@app/services/empresa/convenios/alta-wizard/componentes/entidades.service';
import { FormasDePagoService } from '@app/services/empresa/convenios/alta-wizard/componentes/formas-de-pago.service';
import { GrillaEmpresaService } from '@app/services/empresa/convenios/alta-wizard/componentes/grilla-empresa.service';
import { PlanesConvenidosService } from '@app/services/empresa/convenios/alta-wizard/componentes/planes-convenidos.service';
import { ReferenteEmpresaService } from '@app/services/empresa/convenios/alta-wizard/componentes/referente-empresa.service';
import { SubsidiosService } from '@app/services/empresa/convenios/alta-wizard/componentes/subsidios.service';
import { SucursalesService } from '@app/services/empresa/convenios/alta-wizard/componentes/sucursales.service';
import { ContactoService } from '@app/services/empresa/convenios/alta-wizard/componentes/contacto.service';
import { DetalleDatosGeneralesComponent } from './detalles-edicion/detalle-datos-generales/detalle-datos-generales.component';
import { DetalleArchivosComponent } from './detalles-edicion/detalle-archivos/detalle-archivos.component';
import { DetalleContactoComponent } from './detalles-edicion/detalle-contacto/detalle-contacto.component';
import { DetalleVipComponent } from './detalles-edicion/detalle-vip/detalle-vip.component';
import { VipService } from '@app/services/empresa/convenios/alta-wizard/componentes/vip.service';

@NgModule({
	declarations: [
		ListConvenioDefinitivoComponent,
		DetallesEdicionComponent,

		// Componentes
		DetalleDatosGeneralesComponent,
		DetalleContactoComponent,
		DetalleReferenteComponent,
		DetalleGrillasComponent,
		DetallePlanesConvenidosComponent,
		DetalleSubsidiosComponent,
		DetalleFormasPagoComponent,
		DetalleEntidadesComponent,
		DetalleDatosImpositivosComponent,
		DetalleCorrespondenciaComponent,
		DetalleSucursalesComponent,
		DetalleArchivosComponent,
		DetalleVipComponent


	],
	imports: [
		ConvenioDefinitivoRoutingModule,
		SharedModule,
		FormsModule,
		CommonModule

	],
	exports: [],
	providers: [
		ConvenioDefinitivoService,
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
	]
})
export class ConvenioDefinitivoModule { }
