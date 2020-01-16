import { Injectable } from '@angular/core';
import { environment } from '@env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { CabeceraConvenioDTO } from '@app/models/cabecera-convenio.model';
import { PlanConvenidoDTO } from '@app/models/planes-convenidos.model';
import { ProductoDTO } from '@app/models/producto.model';

@Injectable()
export class PlanesConvenidosService{


    constructor(private http: HttpClient) { }

    baseUrl = environment.baseUrl;
    baseUrlEmpresas = environment.baseUrlEmpresas;
    
    /**
     * DEFINITIVO
     */
    addCabeceraConvenioD(cabeceraConvenioDTO:CabeceraConvenioDTO): Observable<CabeceraConvenioDTO>{
        return this.http.post<CabeceraConvenioDTO>(`${this.baseUrl}/Empresas/api/planConvenido/cabecera`, cabeceraConvenioDTO).pipe(
            catchError(e => throwError(new Error(e)))
        );
    }

    /* Busqueda de convenio cabecera */
    getCabeceraConvenioD(convenioId:number):Observable<CabeceraConvenioDTO[]>{
        return this.http.get<CabeceraConvenioDTO[]>(`${this.baseUrl}/Empresas/api/planConvenido/cabecera?convenioId=${convenioId}`).pipe(
            catchError(e => throwError(new Error(e)))
        );
    }

    /* Alta de Detalle de planes convenidos */
    addPlanConvenidoD(planConvenidoDTO:PlanConvenidoDTO): Observable<PlanConvenidoDTO>{
        return this.http.post<PlanConvenidoDTO>(`${this.baseUrl}/Empresas/api/planConvenido`, planConvenidoDTO).pipe(
            catchError(e => throwError(new Error(e)))
        );
    }

    /* Busqueda de Detalles de planes convenidos */
    getPlanesConvenidosD(idCabecera:number):Observable<PlanConvenidoDTO[]>{
        return this.http.get<PlanConvenidoDTO[]>(`${this.baseUrl}/Empresas/api/planConvenido?idCabecera=${idCabecera}`).pipe(
          catchError(e => throwError(new Error(e)))  
        );
    }
   
    deletePlanesConvenidosD(planConvenidoDTO:PlanConvenidoDTO){
		const options = {
			headers: new HttpHeaders({
			  'Content-Type': 'application/json',
			}),
			body: planConvenidoDTO
		  };
		
          return this.http.delete(`${this.baseUrl}/Empresas/api/planConvenido/${planConvenidoDTO.id}`);
        
	}
    /**
     * TEMPORARIO
     */
    /* Alta de convenio cabecera */
    addCabeceraConvenio(cabeceraConvenioDTO:CabeceraConvenioDTO): Observable<CabeceraConvenioDTO>{
        return this.http.post<CabeceraConvenioDTO>(`${this.baseUrl}/Empresas/api/planConvenido/cabecera/wizard`, cabeceraConvenioDTO).pipe(
            catchError(e => throwError(new Error(e)))
        );
    }

    /* Busqueda de convenio cabecera */
    getCabeceraConvenio(convenioId:number):Observable<CabeceraConvenioDTO[]>{
        return this.http.get<CabeceraConvenioDTO[]>(`${this.baseUrl}/Empresas/api/planConvenido/cabecera/wizard?convenioId=${convenioId}`).pipe(
            catchError(e => throwError(new Error(e)))
        );
    }

    /* Alta de Detalle de planes convenidos */
    addPlanConvenido(planConvenidoDTO:PlanConvenidoDTO): Observable<PlanConvenidoDTO>{
        console.log(planConvenidoDTO);
        return this.http.post<PlanConvenidoDTO>(`${this.baseUrl}/Empresas/api/planConvenido/wizard`, planConvenidoDTO).pipe(
            catchError(e => throwError(new Error(e)))
        );
    }

    /* Busqueda de Detalles de planes convenidos */
    getPlanesConvenidos(idCabecera:number):Observable<PlanConvenidoDTO[]>{
        return this.http.get<PlanConvenidoDTO[]>(`${this.baseUrl}/Empresas/api/planConvenido/wizard?idCabecera=${idCabecera}`).pipe(
          catchError(e => throwError(new Error(e)))  
        );
    }
   
    deletePlanesConvenidos(planConvenidoDTO:PlanConvenidoDTO){ 
		const options = {
			headers: new HttpHeaders({
			  'Content-Type': 'application/json',
			}),
			body: planConvenidoDTO
		  };
		
          return this.http.delete(`${this.baseUrl}/Empresas/api/planConvenido/wizard/${planConvenidoDTO.id}`);
        
    }
    
    getProductosPlanesConvenidos():Observable<ProductoDTO[]>{
       return this.http.get<ProductoDTO[]>(`${this.baseUrlEmpresas}/SancorSalud/webresources/ServicioProducto/productosSuperadoresPorEmpresa`);
    }
     
}
	