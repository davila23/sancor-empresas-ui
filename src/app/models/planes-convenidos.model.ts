import { EmpresaDTO } from './empresa/empresa.model';
import { CabeceraConvenioDTO } from './cabecera-convenio.model';
import { MaestroPlanDTO } from './maestro-plan.model';

export class PlanConvenidoDTO {

    /*IDENTIFICADOR*/
    id:number;
    /*VIENEN DESDE ARRIBA */
    empresa:EmpresaDTO;
    cabecera: CabeceraConvenioDTO;
    /*LOS QUE VAN AL FRONT*/
    plan:MaestroPlanDTO;//extrae el codigo
    producto:number;
    cantidadMeses:number;
    planId:number;
    porcentaje:number;
    porcentajeBonificacion:number;
    bonificacionRecaudo:string;//Bonificacion y Recaudo

    /*ESTAN DE MAS */
    vigencia:Date;
    cantidadGruposParaBonificar:number;
    cantidadIntegrantesParaBonificar:number;
    fechaVigenciaHasta:string;

    fechaFinVigenciaBonificacion:string;

}
