import { ConvenioDTO } from './convenio-temporal/convenio.model';
import { EmpresaDefinitivaDTO } from './empresa-definitiva.model';

export class RelacionConvenioConFacturadoraDTO {
    convenio:ConvenioDTO;
    empresaFacturadora:EmpresaDefinitivaDTO;
}