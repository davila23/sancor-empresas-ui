import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

const urlOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/x-www-form-urlencoded'
	}),
	withCredentials: true
};

@Injectable()
export class HttpService {

	constructor(
		private http: HttpClient,
		private snackBar: MatSnackBar,
		private encoder: HttpUrlEncodingCodec
	) { }

	baseUrl;

	async get(url: string | null, datos: any = null) {
		const options = datos ? this.paramsRequest(datos) : urlOptions;
		try {
			const res = await this.http.get<any>(this.baseUrl + url, options).toPromise();
			return res;
		} catch (error) {
			this.error(error);
			return null;
		}
	}

	async post(url: string, datos: any = null) {
		try {
			const res = await this.http.post<any>(this.baseUrl + url, this.stringifyParams(datos), urlOptions).toPromise();
			return res;
		} catch (error) {
			this.error(error);
			return null;
		}
	}

	/**
	 * Trae los datos pedidos filtrados por coincidencia con el texto provisto
	 * @param que - Qué busca
	 * @param texto - Texto a buscar
	 * @param datos (opcional) - Parámetros adicinoales
	 * @example autocomplete('rubros','activo')
	 * @return Array con resultados
	 */
	async autocomplete(que: string, texto: string, datos?: any) {
		if (!datos) {
			datos = {};
		}
		return await this.get(`autocomplete/${que}`, Object.assign({ texto: texto }, datos));
	}

	private stringifyParams(datos: any) {
		let pm = '';
		for (const key in datos) {
			if (datos.hasOwnProperty(key)) {
				pm += `${key}=${datos[key] !== null ? this.encoder.encodeValue(datos[key].toString()) : ''}&`;
			}
		}
		return pm.substring(0, pm.length - 1);
	}

	private paramsRequest(datos: any) {
		let params = new HttpParams();
		for (const key in datos) {
			if (datos.hasOwnProperty(key)) {
				params = params.set(key, datos[key]);
			}
		}
		return Object.assign({ params: params }, urlOptions);
	}

	private error(err) {
		this.snackBar.open('Ha ocurrido un error', null, {
			duration: 5000,
			horizontalPosition: 'end',
			verticalPosition: 'top'
		});
		console.error(err);
		throw new Error('Ocurrió un error en una llamada al backend');
	}
}
