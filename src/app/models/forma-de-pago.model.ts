export class FormaDePagoConvenioDTO{

    //Campos Generales
    idConvenio:number;
    descripcion:string;
    numero:number;
    tipo:string;
    cuenta:number;
    formaDePago:string;
    //Campos Tarjeta de Credito
    numeroTarjeta:number;
    codigoTarjeta:number;
    bancoEmisor:number;
    codSeguridad:number;
    fechaVencimiento:number;//fecha
    cuentaNumero:number;
	tipoCuenta:string;
	numeroFormaPago:number;
    //Campos CBU
    codigoEnvio:number;
    nroCbu:string;
    confirmaCbu:string;
    banco:number;
    sucursal:number;
    nroTipoCuenta:number;//Caja Ahorro,etc
    numeroCuenta:number;
    tipoCuentaString:string;//CC,CA
    nroEnvio:number;//No completar
    estado:number;//No completar
    cuentaDataNet:string;//TipoCuenta(Af/Empresa(TCA))(char1)+sucursal(char3)+nrocuenta(del 11 al 22)+
    apellido:string;
    nombre:string;
    cuil:number;
    reintegros:string;
    alias:string;
    extension:ExtensionCbuDTO;
    numeroAfiliado:number;
	formaPago:number;
	

}

export class ExtensionCbuDTO{
   	
		tipoCuenta:string;
  		numeroAfiliado:number;
  		formaPago:number;
  		alias:string;
	
}