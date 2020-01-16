import { EmpresaDTO } from './empresa/empresa.model';
import { ProductoDTO } from './producto.model';
import { ConvenioDTO } from './convenio-temporal/convenio.model';
import { PlanDTO } from './plan.model';

export class SubsidioEmpresaDTO{
    convenio:ConvenioDTO;
    empresa:EmpresaDTO;
    producto:ProductoDTO;
    plan:PlanDTO;
}