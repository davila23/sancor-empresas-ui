import { EmpresaDTO } from './empresa/empresa.model';

export class CabeceraConvenioDTO {
    id:number;
    empresa:EmpresaDTO;
    idConvenio:number;
    vigencia: Date;
    cantidadGruposParaBonificar:number;
    cantidadIntegrantesParaBonificar:number;
    porcentaje:number;
    fechaVigenciaHasta:number;
}