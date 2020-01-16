import { Injectable } from '@angular/core';
import { ConvenioTemporalDTO } from '@app/models/convenio-temporal/convenio-temporal.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';

@Injectable()
export class ConvenioDefinitivoService {

  baseUrl = environment.baseUrl;

	constructor(private http: HttpClient) { }

	getConveniosDefinitivos(idConvenio = '', idEmpresa = '', estado = ''): Observable<any> {

    const url = `${this.baseUrl}/Empresas/api/convenio/wizard-definitivo-simplificado?idConvenio=${idConvenio}&idEmpresa=${idEmpresa}&estado=${estado}`;

		return this.http.get(url);
	}
}
