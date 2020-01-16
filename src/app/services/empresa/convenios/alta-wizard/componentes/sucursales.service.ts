import { Injectable } from '@angular/core';
import { SucursalEmpresaDTO } from '@app/models/sucursal-empresa.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '@env';
import { RequestOptions } from '@angular/http';
import { LocalidadDTO } from '@app/models/localidad.model';

@Injectable()
export class SucursalesService {

	constructor(private http: HttpClient) { }

	baseUrl = environment.baseUrl;
	baseUrlEmpresas = environment.baseUrlEmpresas;

	/**
   * DEFINITIVO
   */

	 /*POST SUCURSALES*/
	addSucursalEmpresaD(sucursal: SucursalEmpresaDTO): Observable<SucursalEmpresaDTO> {
		return this.http.post<SucursalEmpresaDTO>(`${this.baseUrl}/Empresas/api/sucursalempresa`, sucursal);
	}

	/*GET SUCURSALES
	 VER COMO ESTA IMPLEMENTADOR EN DEFINITIVO
	*/
	getSucursalesEmpresaD(empresaId: number): Observable<SucursalEmpresaDTO[]> {
		let busqueda = { "empresaId": empresaId };
		return this.http.post<SucursalEmpresaDTO[]>(`${this.baseUrl}/Empresas/api/sucursalempresa/search`, busqueda);
	}

	/* DELETE SUCURSALES */
	deleteSucursarEmpresaD(sucursalItem: SucursalEmpresaDTO) {
		const options = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			}),
			body: {
				empresaId: sucursalItem.empresaId,
				idSucursal: sucursalItem.idSucursal,
			},
		};

		return this.http.delete(`${this.baseUrl}/Empresas/api/sucursalempresa`,
			options
		)
	}

	/**
   * TEMPORAL
   */
	/*POST SUCURSALES*/
	addSucursalEmpresa(sucursal: SucursalEmpresaDTO): Observable<SucursalEmpresaDTO> {
		return this.http.post<SucursalEmpresaDTO>(`${this.baseUrl}/Empresas/api/sucursalempresa/wizard`, sucursal);
	}

	/*GET SUCURSALES*/
	getSucursalesEmpresa(empresaId: number): Observable<SucursalEmpresaDTO[]> {
		let busqueda = { "empresaId": empresaId };
		console.log(busqueda);
		return this.http.post<SucursalEmpresaDTO[]>(`${this.baseUrl}/Empresas/api/sucursalempresa/searchwizard`, busqueda);
	}

	/* DELETE SUCURSALES */
	deleteSucursarEmpresa(sucursalItem: SucursalEmpresaDTO) {
		const options = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			}),
			body: {
				empresaId: sucursalItem.empresaId,
				idSucursal: sucursalItem.idSucursal,
			},
		};

		return this.http.delete(`${this.baseUrl}/Empresas/api/sucursalempresa/wizard`,
			options
		)
	}

	getLocalidades(value): Observable<any> {

		const url = `${this.baseUrlEmpresas}/SancorSalud/webresources/ServicioLocalidad/autocompletar?texto=${value}`;

		return this.http.get(url);
	}

}
