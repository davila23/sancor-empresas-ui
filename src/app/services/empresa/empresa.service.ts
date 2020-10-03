import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { EmpresaDTO } from '@app/models/empresa/empresa.model';
import { ApiResponseDTO } from '@app/models/empresa/ApiResponse.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ActividadAfipDTO } from '@app/models/empresa/actividad-afip.model';
import { environment } from '@env';
import { ResponsableNegocioDTO } from '@app/models/empresa/responsable-negocio.model';

@Injectable()
export class EmpresaService {

	baseUrl = environment.baseUrl;

	constructor(private http: HttpClient) { }

	obtenerActividadesEmpresa(): Observable<ActividadAfipDTO[]> {
		return this.http.get<ActividadAfipDTO[]>(`${this.baseUrl}/Empresas/api/ActividadesEmpresa`)
			.pipe(
				catchError(e => throwError(new Error(e)))
			);
	}


	/** Obtengo las empresas por campo */
	searchEmpresas(searchField: any): Observable<EmpresaDTO[]> {

		let params = null;

		if (this.isFixed(searchField)) {
			params = new HttpParams().set('cuit', searchField);
		} else {

			params = new HttpParams().set('razonSocial', String(searchField).trim());
		}

		return this.http.get<EmpresaDTO[]>(`${this.baseUrl}/Empresas/api/empresaDefinitiva`, { params: params });
	}

	getEmpresaById(id: Number): Observable<EmpresaDTO> {
		const params = new HttpParams().set('id', String(id));
		return this.http.get<EmpresaDTO>(`${this.baseUrl}/Empresas/api/empresaDefinitiva`, { params: params });
	}

	getEmpresas(): Observable<EmpresaDTO[]> {
		return this.http.get<EmpresaDTO[]>(`${this.baseUrl}/Empresas/api/empresaDefinitiva`)
			.pipe(
				catchError(e => throwError(new Error(e)))
			);
	}

	addEmpresa(empresa: EmpresaDTO): Observable<any> {
		return this.http.post<EmpresaDTO>(`${this.baseUrl}/Empresas/api/empresaDefinitiva`, empresa)
			.pipe(
				catchError(e => throwError(new Error(e)))
			);
	}

	// addEmpresa (empresa: EmpresaDTO): Observable<any> {
	// 	return this.http.post<EmpresaDTO>(`${this.baseUrl }/Empresas/api/saveAndGetIdEmpresa`, empresa)
	// 		.pipe(
	// 		catchError(e => throwError(new Error(e)))
	// 		);
	// }


	isFixed = (o: any) => {
		const s = String(o);
		return !isNaN(+s) && isFinite(+s) && (typeof o === 'number' || !/e/i.test(s));
	}

	postResponsablesNegocio(responsable: ResponsableNegocioDTO): Observable<any> {
		return this.http.post<any>(`${this.baseUrl}/Empresas/api/responsableDelNegocio`, responsable)
			.pipe(
				catchError(e => throwError(new Error(e)))
			);
	}

	getResponsablesNegocioByEmpresa(empresaId): Observable<any> {
		return this.http.get(`${this.baseUrl}/Empresas/api/responsableDelNegocio?empresaId=${empresaId}`);
	}

	getResponsablesNegocio(): Observable<any> {
		return this.http.get(`${this.baseUrl}/Empresas/api/responsableDelNegocio`);
	}

	deleteResponsableNegocio(body): Observable<any> {
		const options = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			}),
			body: body
		};

		return this.http.delete(`${this.baseUrl}/Empresas/api/responsableDelNegocio`, options);

	}
	
	validaUnicidadConvenio(idEmpresa): Observable<any> {
		const url = `${this.baseUrl}/Empresas/api/convenio/valida-unicidad-de-convenio?idEmpresa=${idEmpresa}`;

		return this.http.get(url).pipe(map(this.extractData));
	}

	private extractData(res: Response) {
		return res || {};
	}

}
