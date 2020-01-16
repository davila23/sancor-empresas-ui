import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CondicionIvaDTO } from '@app/models/empresa/condicion-iva-model';
import { Observable } from 'rxjs';
import { environment } from '@env';

@Injectable()
export class CondicionIvaService {

  apiURL = `${environment.baseUrl}/Empresas/api`;
    
	constructor(private http: HttpClient) {}

    getCondicionesIva():Observable<CondicionIvaDTO[]>{
        return this.http.get<CondicionIvaDTO[]>(
            `${this.apiURL}/CondicionesIVA`
        );
    }

    
}