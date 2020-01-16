import { Injectable } from '@angular/core';
import { ConvenioTemporalDTO } from '@app/models/convenio-temporal/convenio-temporal.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env';

@Injectable()
export class ConvenioTemporalService {

	baseUrl = environment.baseUrl;

	constructor(private http: HttpClient) { }

	getConveniosTemporalesByUser(): Observable<ConvenioTemporalDTO[]> {
		return this.http.get<ConvenioTemporalDTO[]>(
			`${environment.baseUrl}/Empresas/api/convenio/wizard-temporal-simplificado`
		);
	}


}
