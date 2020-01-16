import { CondicionIvaDTO } from './empresa/condicion-iva-model';
import { ActividadAfipDTO } from './empresa/actividad-afip.model';
import { RamoEmpresaDTO } from './empresa/ramo-empresa.model';

export class EmpresaDefinitivaDTO {

    id:number;
	cuit:number;
	razonSocial:string;
	nombreFantasia:string;
	condicionIva:CondicionIvaDTO;
    numeroAnsal:number;
	numeroIngresosBrutos:string;
	actividadAfip:ActividadAfipDTO;
    calle:string;
	numeroCalle:number;
	piso:number;
	departamento:string;
	cpLocalidad:number;
	cpArgentino:string;
	telFijo:string;
	telCelular:string;
	email:string;
	ramo:RamoEmpresaDTO;
	//private List<ConvenioDTO> convenios;
	//private Boolean edicion;
	usuario:string;
}
