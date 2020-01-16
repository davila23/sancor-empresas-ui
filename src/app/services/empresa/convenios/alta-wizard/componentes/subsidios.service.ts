import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env';
import { SubsidioEmpresaDTO } from '@app/models/subsidio-empresa.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductoDTO } from '@app/models/producto.model';
import { PlanDTO } from '@app/models/plan.model';


@Injectable()
export class SubsidiosService {

    constructor(private http: HttpClient) { }

    baseUrl = environment.baseUrl;
    baseUrlEmpresas = environment.baseUrlEmpresas;

    /**
     * DEFINITIVO
     */

    /* GET - /Empresas/api/subsidios/wizard?convenioId=1*/
    getSubsidiosPorEmpresaD(convenioId:Number):Observable<SubsidioEmpresaDTO[]>{
        return this.http.get<SubsidioEmpresaDTO[]>(`${this.baseUrl}/Empresas/api/subsidios?idEmpresa=${convenioId}`);
    }

     /*POST - /Empresas/api/subsidios/wizard*/
     addSubsidiosPorEmpresaD(subsidioEmpresaDTO:SubsidioEmpresaDTO):Observable<SubsidioEmpresaDTO>{
        return this.http.post<SubsidioEmpresaDTO>(`${this.baseUrl}/Empresas/api/subsidios`,subsidioEmpresaDTO);
    }

    deleteSubsidiosEmpresaD(subsidioEmpresaDTO: SubsidioEmpresaDTO){
        let listaSubsidios:SubsidioEmpresaDTO[] = [];

        listaSubsidios[0] = subsidioEmpresaDTO;

        console.log(listaSubsidios);

		const options = {
			headers: new HttpHeaders({
			  'Content-Type': 'application/json',
			}),
			body:{
                lista:listaSubsidios
            }

		};

        return this.http.delete(`${this.baseUrl}/Empresas/api/subsidios`, options)
    }

    /**
     * TEMPORARIO
     */

    /* GET - /SancorSalud/webresources/ServicioProducto/listar */
    getListaProductos(descripcion:string):Observable<ProductoDTO[]>{
          let productoDescripcion = {"descripcion":descripcion};
          return this.http.post<ProductoDTO[]>(`${this.baseUrlEmpresas}/SancorSalud/webresources/ServicioProducto/listar`,productoDescripcion)
      }

    getListaProductosSubsidios():Observable<ProductoDTO[]>{
          return this.http.get<ProductoDTO[]>(`${this.baseUrlEmpresas}/SancorSalud/webresources/ServicioProducto/listarSubsidios`)
          
          //return this.http.get<ProductoDTO[]>(`http://serviciosjbosstest.ams.red:8080/SancorSalud/webresources/ServicioProducto/listarSubsidios`)
    }

    getListaPlanesByProducto(codigoProducto:number):Observable<PlanDTO[]>{
        let productoCodigo = {"codigoProducto":codigoProducto};
        return this.http.post<PlanDTO[]>(`${this.baseUrlEmpresas}/SancorSalud/webresources/ServicioPlanes/listarPlanesConProductos`, productoCodigo);
        //return this.http.post<PlanDTO[]>(`http://serviciosjbosstest.ams.red:8080/SancorSalud/webresources/ServicioPlanes/listarPlanesConProductos`, productoCodigo);
    }

    /* GET - /Empresas/api/subsidios/wizard?convenioId=1*/
    getSubsidiosPorEmpresa(convenioId:Number):Observable<SubsidioEmpresaDTO[]>{
        return this.http.get<SubsidioEmpresaDTO[]>(`${this.baseUrl}/Empresas/api/subsidios/wizard?idEmpresa=${convenioId}`);
    }

    /*POST - /Empresas/api/subsidios/wizard*/
    addSubsidiosPorEmpresa(subsidioEmpresaDTO:SubsidioEmpresaDTO):Observable<SubsidioEmpresaDTO>{
        return this.http.post<SubsidioEmpresaDTO>(`${this.baseUrl}/Empresas/api/subsidios/wizard`,subsidioEmpresaDTO);
    }

    deleteSubsidiosEmpresa(subsidioEmpresaDTO: SubsidioEmpresaDTO){
        let listaSubsidios:SubsidioEmpresaDTO[] = [];

        listaSubsidios[0] = subsidioEmpresaDTO;

        console.log(listaSubsidios);

		const options = {
			headers: new HttpHeaders({
			  'Content-Type': 'application/json',
			}),
			body:{
                lista:listaSubsidios
            }

		};

        return this.http.delete(`${this.baseUrl}/Empresas/api/subsidios/wizard`, options)
    }



}
