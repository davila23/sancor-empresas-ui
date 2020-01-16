import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ConvenioMovimientoDTO } from '@app/models/convenio-movimiento.model';
import { Observable } from 'rxjs';
import { environment } from '@env';
import { ErrorOperacionDTO } from '@app/models/error-operacion.model';

@Injectable()
export class ControlConvenioService{
    
  constructor(private http: HttpClient) { }

  getEstadoConvenio(convenioId): Observable<ConvenioMovimientoDTO> {
    return this.http.get<ConvenioMovimientoDTO>(`${environment.baseUrl}/Empresas/api/convenio/estado?convenioId=${convenioId}`);
  }

  obtenerListaControlConvenio(usuario?: '', estado?: ''):Observable<ConvenioMovimientoDTO[]>{
    const body = {
      idConvenio: null,
      idEstados: estado, // Hardcodear a 2
      usuario: usuario
    }

    //return this.http.post<ConvenioMovimientoDTO[]>(`${environment.baseUrl}/Empresas/api/convenio/estado/filtrado`, body);
    return this.http.get<ConvenioMovimientoDTO[]>(`${environment.baseUrl}/Empresas/api/convenio/wizard-temporal-simplificado?estado=${estado}`);
 
  }

  guardarConvenioDefinitivo(convenioId):Observable<ErrorOperacionDTO[]>{
    const body = {
      id:convenioId
    }
    return this.http.post<ErrorOperacionDTO[]>(`${environment.baseUrl}/Empresas/api/convenio`,body);
  }

  addConvenioMovimiento(convenioMovimiento:ConvenioMovimientoDTO):Observable<ConvenioMovimientoDTO>{
    return this.http.post<ConvenioMovimientoDTO>(`${environment.baseUrl}/Empresas/api/convenio/estado`,convenioMovimiento);
  }

  updateConvenioMovimiento(convenioMovimiento:ConvenioMovimientoDTO):Observable<ConvenioMovimientoDTO>{
    return this.http.put<ConvenioMovimientoDTO>(`${environment.baseUrl}/Empresas/api/convenio/estado`,convenioMovimiento);
  }

}