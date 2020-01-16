import {CondicionIvaDTO} from './condicion-iva-model';
import { ActividadAfipDTO } from './actividad-afip.model';


export class EmpresaDTO {
	id: number;
	cuit: number;
	razonSocial: string;
	condicionIva: CondicionIvaDTO;
	condicionIvaId: number;
	numeroIngresosBrutos: number;
	actividadAfip: ActividadAfipDTO;
	estado: string;
	calle: string;
	numeroCalle: number;
	piso: number;
	departamento: string;
	cpLocalidad: number;
	cpArgentino: string;
	telFijo: number;
	telCelular: number;
	email: string;
	usuario: string;
}
