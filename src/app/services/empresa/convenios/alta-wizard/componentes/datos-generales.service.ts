import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { environment } from '@env';
import { Observable, timer, of,  } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DatosGeneralesService {


  constructor(private http: HttpClient) { }


  baseUrl = environment.baseUrl;
  baseUrlEmpresas = environment.baseUrlEmpresas;
  baseEjecutivoUrl = environment.baseEjecutivoUrl;

  /**
    * DEFINITIVO
  **/

  getDatosGeneralesD(convenioId):Observable<any> {
    const url = `${this.baseUrl}/Empresas/api/convenio?idConvenio=${convenioId}`;

    return this.http.get(url).pipe(map(this.extractData));
  }

  postDatosGeneralesD(value): Observable<any> {
    const url = `${this.baseUrl}/Empresas/api/convenio`;
     return this.http.post(url, value).pipe(map(this.extractData));

  }

  actualizarDatosGenerales(value): Observable<any>{
     const url = `${this.baseUrl}/Empresas/api/convenio`;
     return this.http.put(url, value).pipe(map(this.extractData));
  }
  /*
  * TEMPORARIO
  */

  getHoldingsList(): Observable<any> {
    const url = `${this.baseUrl}/Empresas/api/holding`;

    return this.http.get(url).pipe(map(this.extractData));
  }

  getTipoIngresoList(): Observable<any> {
    const url = `${this.baseUrl}/Empresas/api/tipoIngresoConvenio`;

    return this.http.get(url).pipe(map(this.extractData));
  }

  getMovimientoAsociado(): Observable<any> {
    const url = `${this.baseUrl}/Empresas/api/tipoMovimientoAsociado`;

    return this.http.get(url).pipe(map(this.extractData));
  }

  getCredenciales(): Observable<any> {
    const url = `${this.baseUrl}/Empresas/api/convenio/envios-credencial`;

    return this.http.get(url).pipe(map(this.extractData));
  }

  getEjecutivoConvenio(value): Observable<any> {
  //  const url = `${this.baseEjecutivoUrl}/Comercial/webresources/ServicioPersona/autocompletarEjecutivo?descripcion=${value}`;
    const url = `http://testcomercialsvc.ams.red:8080/Comercial/webresources/ServicioPersona/autocompletarEjecutivo?descripcion=${value}`;
    return this.http.get(url);
  }

  getEntidades(value): Observable<any> {
    const url = `${this.baseUrlEmpresas}/asociados/api/CotizacionEntidades_Listar/${value}`;

    return this.http.get(url);
  }

  getDatosGenerales(convenioId):Observable<any> {
    const url = `${this.baseUrl}/Empresas/api/convenio/wizard?idConvenio=${convenioId}`;

    return this.http.get(url).pipe(map(this.extractData));
  }

  postDatosGenerales(value): Observable<any> {
    //const url = 'http://172.22.111.157:8080/Empresas/api/convenio/wizard';
    const url = `${this.baseUrl}/Empresas/api/convenio/wizard`;
    console.log(value);

    return this.http.post(url, value).pipe(map(this.extractData));
  }

  private extractData(res: Response) {
    return res || {};
  }
}
