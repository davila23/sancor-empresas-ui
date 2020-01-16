import { EmpresaFacturadoraDTO } from './empresa-facturadora.model';

export class ProductoDTO{
    codigo:number;
    descripcion:string;
    descripcionReducida:string;
    claseProducto:string;
    tipoProducto:string;
    empresaFacturadora:EmpresaFacturadoraDTO;
    fuenteIngresoCodigo:number;
    idEmpresa:number;

}