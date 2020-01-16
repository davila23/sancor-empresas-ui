import { ConvenioDTO } from './convenio-temporal/convenio.model';
import { EmpresaDTO } from './empresa/empresa.model';
import { ProductoDTO } from './producto.model';
import { GrillaDTO } from './grilla.model';

export class ProductoGrillaEmpresaDTO{

    grilla:GrillaDTO;
    convenio:ConvenioDTO;
    empresa:EmpresaDTO;

}
