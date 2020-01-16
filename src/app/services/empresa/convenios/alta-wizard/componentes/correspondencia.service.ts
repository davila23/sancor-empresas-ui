import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { EnvioCorrespondenciaDTO } from '@app/models/envio-correspondencia.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env';

@Injectable()
export class CorrespondenciaService {

	constructor(private http: HttpClient) { }

	baseUrl = environment.baseUrl;

	/**
    * DEFINITIVO
    */

	/*GET CORRESPONDENCIA*/
	getCorrespondenciaD(empresaId: number): Observable<EnvioCorrespondenciaDTO[]> {
		return this.http.get<EnvioCorrespondenciaDTO[]>(`${this.baseUrl}/Empresas/api/enviocorrespondencia?empresaId=${empresaId}`);
	}

	/*POST CORRESPONDENCIA*/
	addCorrespondenciaD(correspondencia: EnvioCorrespondenciaDTO): Observable<EnvioCorrespondenciaDTO> {
		return this.http.post<EnvioCorrespondenciaDTO>(`${this.baseUrl}/Empresas/api/enviocorrespondencia`, correspondencia);
	}

	/*DELETE CORRESPONDENCIA */
	deleteCorrespondenciaD(envioCorrespondenciaDTO: EnvioCorrespondenciaDTO) {
		const options = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			}),
			body: envioCorrespondenciaDTO
		};
		return this.http.delete(`${this.baseUrl}/Empresas/api/enviocorrespondencia`, options)
	}


	/**
   * WIZARD
   */

	/*GET CORRESPONDENCIA*/
	getCorrespondencia(convenioId: number): Observable<EnvioCorrespondenciaDTO[]> {
		return this.http.get<EnvioCorrespondenciaDTO[]>(`${this.baseUrl}/Empresas/api/enviocorrespondencia/wizard?convenioId=${convenioId}`);
	}

	/*POST CORRESPONDENCIA*/
	addCorrespondencia(correspondencia: EnvioCorrespondenciaDTO): Observable<EnvioCorrespondenciaDTO> {
		return this.http.post<EnvioCorrespondenciaDTO>(`${this.baseUrl}/Empresas/api/enviocorrespondencia/wizard`, correspondencia);
	}

	/*DELETE CORRESPONDENCIA */
	deleteCorrespondencia(envioCorrespondenciaDTO: EnvioCorrespondenciaDTO) {
		const options = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			}),
			body: envioCorrespondenciaDTO
		};
		return this.http.delete(`${this.baseUrl}/Empresas/api/enviocorrespondencia/wizard`, options)
	}
}
