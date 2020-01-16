import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@env';

/**
 * Opciones a enviar en peticiones al Back-End. Incluye cabecera y envío de credenciales
 */
const urlOptions = {
	withCredentials: true
};


/**
 * Servicio injectable para realizar peticiones al back-end
 */
@Injectable()
export class HttpService {

	constructor(
		private http: HttpClient,
		private snackBar: MatSnackBar
	) {}

	/** URL base para ejecución de scripts PHP. Utiliza variable environment que cambia de absoluto (dev) a relativo (prod) */
	private baseUrl = environment.baseUrl;

	/**
	 * Loguea un usuario en el sistema
	 * @param user - Nombre de usuario
	 * @param pass - Contraseña del usuario
	 * @response {valid: boolean, razsocial: string}
	 */
	login(user: string, pass: string) {
		return this.http.post<any>(this.baseUrl + 'macnolog.php?login', `usuario=${user}&contra=${pass}`, urlOptions);
	}

	/**
	 * Desloguea usuario del sistema
	 * @response {out: boolean, razsocial: string}
	 */
	logout() {
		return this.http.get<any>(this.baseUrl + `macnolog.php?logout`, urlOptions);
	}

	/**
	 * Busca datos para cargar en el hojeador, según haya búsqueda o no
	 * @param que - Objeto a buscar
	 * @param page - Número de página del hojeador
	 * @param datos - Datos para el filtro: fecha, texto de búsqueda
	 * @response {todas: any[], cuantas: number}
	 */
	async browser(que: string, page: number, datos: any) {
		return await this.post(`hojear/${que}`, Object.assign({ pag: page }, datos));
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

	async get(url: string, datos: any = null) {
		const options = datos ? this.paramsRequest(datos) : urlOptions;
		try {
			const res = await this.http.get<any>(this.baseUrl + url).toPromise();
			return res;
		} catch (error) {
			this.error(error);
			return null;
		}
	}

	async post(url: string, datos: any = null) {
		try {
			const res = await this.http.post<any>(this.baseUrl + url, datos, urlOptions).toPromise();
			return res;
		} catch (error) {
			this.error(error);
			return null;
		}
	}

	async file(url: string, formData: FormData) {
		try {
			const res = await this.http.post(this.baseUrl + url, formData, urlOptions).toPromise();
			return res;
		} catch (error) {
			this.error(error);
			return null;
		}
	}

	private paramsRequest(datos: any) {
		let params = new HttpParams();
		for (const key in datos) {
			if (datos.hasOwnProperty(key)) {
				params = params.set(key, datos[key]);
			}
		}
		return Object.assign({params: params}, urlOptions);
	}

	private error(err) {
		console.error(err);
		this.snackBar.open('Ha ocurrido un error', null, {
			duration: 5000,
			horizontalPosition: 'end',
			verticalPosition: 'top'
		});
		throw new Error('Ocurrió un error en una llamada al backend');
	}

}
