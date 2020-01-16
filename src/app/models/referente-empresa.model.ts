export class ReferenteEmpresaDTO {

    empresaId:number;
    id:number;
    nombreApellido:number;//en el template nombre + apellido
    fechaNacimiento:string;//yyyy-MM-dd
    numeroDocumento:number;
    email:string;
    hobbie:string;
    numeroTelefono:string;

    //Default Values 
    tipoDocumento:number = 96;//default DNI(no se muestra en el template)
    cargo:string = "";
    caracteristicaTelefono:string = "";
    numeroCelular:string = "";
    deporte:string = "";
    estado:number = 0; //0=Activo,1=Baja
   
}