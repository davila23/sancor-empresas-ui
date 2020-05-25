import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env';
import { Observable, throwError } from 'rxjs';
import { SimpleDTO } from '@app/models/simple.model';
import { catchError } from 'rxjs/operators';
import { FormaDePagoEmpresaDTO } from '@app/models/forma-de-pago-empresa.model';
import { FormaDePagoConvenioDTO } from '@app/models/forma-de-pago.model';
import { BancoDTO } from '@app/models/banco.model';

@Injectable()
export class FormasDePagoService {
  //formadepagoempresa
  constructor(private http: HttpClient) { }

  baseUrl = environment.baseUrl;
  baseUrlEmpresas = environment.baseUrlEmpresas;

  /**
   * DEFINITIVO
   */
  /* GET DETALLE FORMA DE PAGO */
  getFormaDePagodetalleD(convenioId: number, tipo: string): Observable<FormaDePagoConvenioDTO[]> {
    return this.http.get<FormaDePagoConvenioDTO[]>(`${this.baseUrl}/Empresas/api/formadepagoempresa/detalle?cuenta=${convenioId}&formaDePago=${tipo}`)
  }


  //cuentaId es igual a convenioId
  getFormasDePagoEmpresasD(convenioId: number): Observable<FormaDePagoConvenioDTO[]> {
    return this.http.get<FormaDePagoConvenioDTO[]>(`${this.baseUrl}/Empresas/api/formadepagoempresa?cuenta=${convenioId}`)
      .pipe(catchError(e => throwError(new Error(e))));
  }
  
  /*POST Alta de los 3 tipos de pago CBU,Tarjetas,Efectivo */
  addFormasDePagoEmpresasD(formaDePagoConvenioDTO: FormaDePagoConvenioDTO): Observable<FormaDePagoConvenioDTO> {
    return this.http.post<FormaDePagoConvenioDTO>(`${this.baseUrl}/Empresas/api/formadepagoempresa`, formaDePagoConvenioDTO)
      .pipe(
        catchError(e => throwError(new Error(e)))
      );
  }
  /*Guarda una tarjeta de credito */
  addFormaDePagoTarjetaD(formaDePagoConvenioDTO: FormaDePagoConvenioDTO){
    return this.http.post<FormaDePagoConvenioDTO>(`${this.baseUrl}/Empresas/api/formadepagoempresa/guardarTarjeta`, formaDePagoConvenioDTO)
    .pipe(
      catchError(e => throwError(new Error(e)))
    );
  }
  
  /*Guarda un CBU */
  addFormaDePagoCbuD(formaDePagoConvenioDTO: FormaDePagoConvenioDTO){
    return this.http.post<FormaDePagoConvenioDTO>(`${this.baseUrl}/Empresas/api/formadepagoempresa/guardarCbu`, formaDePagoConvenioDTO)
    .pipe(
      catchError(e => throwError(new Error(e)))
    );
  }

  deleteFormasDePagoEmpresasD(formaDePagoConvenioDTO: FormaDePagoConvenioDTO) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: formaDePagoConvenioDTO
    };

    return this.http.delete(`${this.baseUrl}/Empresas/api/formadepagoempresa`,
      options
    )
  }

  /**
   * WIZARD
   */

  /* GET DETALLE FORMA DE PAGO */
  getFormaDePagodetalle(convenioId: number, tipo: string): Observable<FormaDePagoConvenioDTO> {
    return this.http.get<FormaDePagoConvenioDTO>(`${this.baseUrl}/Empresas/api/formadepagoempresa/wizard/detalle?cuenta=${convenioId}&formaDePago=${tipo}`)
  }

  /* GET FORMAS DE PAGO*/
  getListarFormasDePago(): Observable<SimpleDTO[]> {
    return this.http.get<SimpleDTO[]>(`${this.baseUrl}/Empresas/api/formadepagoempresa/listar`)
      .pipe(
        catchError(e => throwError(new Error(e)))
      );
  }
  //cuentaId es igual a convenioId
  getFormasDePagoEmpresas(convenioId: number): Observable<FormaDePagoConvenioDTO[]> {
    return this.http.get<FormaDePagoConvenioDTO[]>(`${this.baseUrl}/Empresas/api/formadepagoempresa/wizard?cuenta=${convenioId}`)
      .pipe(catchError(e => throwError(new Error(e))));
  }
  // obtengo Tipos donde tipo puede ser: CBU,TC,BSF(debito automatico),LNK
  getTiposFormasDePago(tipo: string): Observable<SimpleDTO[]> {
    return this.http.get<SimpleDTO[]>(`${this.baseUrl}/Empresas/api/formadepagoempresa/obtenerTipo?tipo=${tipo}`)
  }

  getBancos(): Observable<BancoDTO[]> {
    return this.http.get<BancoDTO[]>(`${this.baseUrl}/Empresas/api/banco/buscarBanco`)
  }

  /*POST Alta de los 3 tipos de pago CBU,Tarjetas,Efectivo */
  addFormasDePagoEmpresas(formaDePagoConvenioDTO: FormaDePagoConvenioDTO): Observable<FormaDePagoConvenioDTO> {
    return this.http.post<FormaDePagoConvenioDTO>(`${this.baseUrl}/Empresas/api/formadepagoempresa/wizard`, formaDePagoConvenioDTO)
      .pipe(
        catchError(e => throwError(new Error(e)))
      );
  }

  deleteFormasDePagoEmpresas(formaDePagoConvenioDTO: FormaDePagoConvenioDTO) {
    console.log(formaDePagoConvenioDTO);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      //body: formaDePagoConvenioDTO

    };
    let convenio = formaDePagoConvenioDTO.cuenta;
    
    let formaDePago = formaDePagoConvenioDTO.formaDePago;
   //?cuenta=${convenio}&formaDePago=${formaDePago}
    //console.log(formaDePago);
    return this.http.delete(`${this.baseUrl}/Empresas/api/formadepagoempresa/wizard?cuenta=${convenio}&formaDePago=${formaDePago}`,
      options
    )
  }

  validarCBU(cbu,cuit):any{
      return this.http.get<any>(`${this.baseUrlEmpresas}/asociados/api/validar/cbu?numeroCBU=${cbu}&&numeroDocumento=${cuit}`)
  }

}