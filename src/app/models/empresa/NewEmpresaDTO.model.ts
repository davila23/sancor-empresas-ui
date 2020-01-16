import { CondicionIvaDTO } from './condicion-iva-model';

export class NewEmpresaDTO {
	id: number;
	cuit: number;
	descripcion: string;
	nombreFantasia: string;
	condicionIva: CondicionIvaDTO;
	numeroAnsal: number;
	numeroIngresosBrutos: number;
	ramo: string;
	actividadEspecifica: string;
	cantidadSucursales: number;
	tipo: number;
	codigoAgrupacion: string;
	condicionVenta: string;
	compensaBonificacionMix: string;
	horarioAtencion: string;
	contratoPorBonificacion: string;
	habilitadoSistemaRecepcion: string;
	habilitadoCorporativoPyme: string;
	fechaInicioCorporativo: string;
	cantidadEmpleados: number;
	numeroPersona: number;
	actividadAfip: string;
	habilitaMonotributo: string;
	habilitaFormaPago: string;
	empresaHolding: string;
	credencialTipo: string;
	facturadoras: string;
	subsidiosHabilitados: string;
	edicion: string;
	usuario: string;
}
