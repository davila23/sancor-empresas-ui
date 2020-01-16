import { Injectable } from '@angular/core';
import { SimpleDTO } from '@app/models/simple.model';
import { Observable, throwError } from 'rxjs';
import { DatosImpositivosDTO } from '@app/models/datos-impositivos.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env';

@Injectable()
export class DatosImpositivosService{

  constructor(private http: HttpClient) { }

	baseUrl = environment.baseUrl;

	/* DEFINITIVO */
  /*DATOS IMPOSITIVOS*/
	getEmpresasQueFacturanD():Observable<SimpleDTO[]>{
		return this.http.get<SimpleDTO[]>(`${this.baseUrl}/Empresas/api/empresa/lasquefacturan`);
	}

	/*GET DATOS IMPOSITIVOS*/
	getDatosImpositivosD(empresaId:number): Observable<DatosImpositivosDTO[]> {
		//${convenioId}&facturadoraId=${facturadoraId}
		return this.http.get<DatosImpositivosDTO[]>(`${this.baseUrl}/Empresas/api/datosimpositivos?empresaId=${empresaId}`);
	}

	/*POST DATOS IMPOSITIVOS*/
	addDatosImpositivosD(datosImpositivos: DatosImpositivosDTO): Observable<DatosImpositivosDTO> {
		return this.http.post<DatosImpositivosDTO>(`${this.baseUrl}/Empresas/api/datosimpositivos`, datosImpositivos);
  }
	
	deleteDatosImpositivosD(datosImpositivosDTO: DatosImpositivosDTO){
    const options = {
				headers: new HttpHeaders({
			  	'Content-Type': 'application/json',
				}),
				body: datosImpositivosDTO,
		};
	  return this.http.delete(`${this.baseUrl}/Empresas/api/datosimpositivos`, options)
  }

	
	
	/*WIZARD*/
  /*DATOS IMPOSITIVOS*/
	getEmpresasQueFacturan():Observable<SimpleDTO[]>{
		return this.http.get<SimpleDTO[]>(`${this.baseUrl}/Empresas/api/empresa/lasquefacturan`);
	}

	/*GET DATOS IMPOSITIVOS*/
	getDatosImpositivos (convenioId:number): Observable<DatosImpositivosDTO[]> {
		//${convenioId}&facturadoraId=${facturadoraId}
		return this.http.get<DatosImpositivosDTO[]>(`${this.baseUrl}/Empresas/api/datosimpositivos/wizard?convenioId=${convenioId}`);
	}

	/*POST DATOS IMPOSITIVOS*/
	addDatosImpositivos(datosImpositivos: DatosImpositivosDTO): Observable<DatosImpositivosDTO> {
		return this.http.post<DatosImpositivosDTO>(`${this.baseUrl}/Empresas/api/datosimpositivos/wizard`, datosImpositivos);
  }
	
	deleteDatosImpositivos(datosImpositivosDTO: DatosImpositivosDTO){
    const options = {
				headers: new HttpHeaders({
			  	'Content-Type': 'application/json',
				}),
				body: datosImpositivosDTO,
		};
	  return this.http.delete(`${this.baseUrl}/Empresas/api/datosimpositivos/wizard`, options)
  }
}