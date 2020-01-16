import { LocalidadDTO } from './localidad.model';

export class SucursalEmpresaDTO{
    empresaId:number;
    idSucursal:number;
    descripcion:string;
    domicilio:string;
    localidad: LocalidadDTO ;
    localidadId:number;
    categoria: string ;
    telefono: string ;
    email: string ;
    estado: number;
}