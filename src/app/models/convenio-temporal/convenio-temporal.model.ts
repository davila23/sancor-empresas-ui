import { EmpresaDTO } from '../empresa/empresa.model';

export class ConvenioTemporalDTO {
	empresa: EmpresaDTO;
	nombre: string;
	vigenciaDesde: string;
	estado: string;
	observaciones: string;
}
