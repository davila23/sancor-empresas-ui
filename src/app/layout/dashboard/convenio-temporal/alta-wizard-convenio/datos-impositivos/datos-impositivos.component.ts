import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { DatosImpositivosService } from '@app/services/empresa/convenios/alta-wizard/componentes/datos-impositivos.service';
import { SimpleDTO } from '@app/models/simple.model';
import { Subscription, BehaviorSubject } from 'rxjs';
import { DatosImpositivosDTO } from '@app/models/datos-impositivos.model';

@Component({
    selector: 'app-datos-impositivos',
		templateUrl: './datos-impositivos.component.html',
		styleUrls: ['./datos-impositivos.component.scss']
  })
  export class DatosImpositivosComponent implements OnInit {

		datosImpositivosServiceSubject : Subscription;
		datosImpositivosList: any = [];
		datosImpositivosDataSource = new MatTableDataSource<any>([]);
		private _convenioId = new BehaviorSubject<number>(0);

		
    constructor(private _fb: FormBuilder, 
                private datosImpositivosService: DatosImpositivosService) { 
		}

    datosImpositivosForm: FormGroup;
    
    ngOnInit() {

			this._convenioId.subscribe(x => {
			this.datosImpositivosServiceSubject = this.datosImpositivosService.getDatosImpositivos(x).subscribe(
				res => {
					if(res==null){
						res = [];
					}
					this.datosImpositivosDataSource.data = res
				}
			)})

      this.datosImpositivosService.getEmpresasQueFacturan().subscribe(
        res => {
					if(res==null){
						res = [];
					}
					this.empresasFacturanList = res
				}
      )

      this.datosImpositivosForm = this._fb.group({
        modalidad: [''],
        facturadoraId:[''],
        tipoComprobante:['']
      });
    }

		private paginator: MatPaginator;

		@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
				this.paginator = mp;
				this.datosImpositivosDataSource.paginator = this.paginator;
		}

		
		datosImpositivos_displayedColumns = [
			'modalidadImpresion',
			'empresasFacturan',
			'tipoComprobante',
			'delete'
		];

		
		empresasFacturan = '';
		modalidadImpresion = '';
		tipoComprobante = '';

		datosImpositivoItem : DatosImpositivosDTO;

		datosImpositivosSaveAndRender() {
			
			if(this.datosImpositivosForm.valid){

					this.datosImpositivoItem = this.datosImpositivosForm.value as DatosImpositivosDTO;
					this.datosImpositivoItem.empresaId = this.empresaIdFlag;
					this.datosImpositivoItem.convenioId = this.convenioIdFlag;

					this.datosImpositivosService.addDatosImpositivos(this.datosImpositivoItem).subscribe(
						res => {
							  this.datosImpositivosService.getDatosImpositivos(this.convenioIdFlag).subscribe(
									res => {
										if(res==null){
											res = [];
										}
										this.datosImpositivosDataSource.data = res;
									}
								)
						}
					)
			}

			this.datosImpositivosForm.reset(
				{modalidadImpresion: '', empresasFacturan: '', tipoComprobante: ''});
		}

		datosImpositivosDelete(row) {
			 
		    this.datosImpositivosService.deleteDatosImpositivos(row).subscribe(
					res => {
						this.datosImpositivosService.getDatosImpositivos(this.convenioIdFlag).subscribe(
							res => {
								if(res==null){
									res = [];
								}
								this.datosImpositivosDataSource.data = res}
						)
					}
				)
		}

		changeEmpresasFacturan(data){
			this.empresasFacturan = data.value;
		}
		changeModalidadImpresion(data){
			this.modalidadImpresion = data.value;
		}
		changeTipoComprobante(data){
			this.tipoComprobante = data.value;
		}

		tipoComprobantesList: { id: string, descripcion: string }[] = [
			{ id: "", "descripcion": "-- Seleccionar --" },
			{ id: "F", "descripcion": "Factura" },
			{ id: "R", "descripcion": "Resumen" }
		];

    empresasFacturanList: SimpleDTO[];
 
		modalidadImpresionList: { id: string, descripcion: string }[] = [
			{ id: "", "descripcion": "-- Ninguno --" },
			{ id: "C", "descripcion": "Conceptos" },
			{ id: "D", "descripcion": "Detallado" }
		];

		@Output() setForms: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

		@Input() set isEdition(isEdition) {
			setTimeout(() => { 
				if (isEdition) {
          this.isEditionFlag = isEdition;
        }
			});
		}
	
		@Input() set empresaId(empresaId) {
			setTimeout(() => {
			 // this.datosGeneralesForm.patchValue({empresa: {id: Number(empresaId)}}); 
				this.empresaIdFlag = empresaId;
			});
		}
	
		@Input() set convenioId(convenioId) {
			this._convenioId.next(convenioId);
			setTimeout(() => {
				if (this.isEditionFlag) {
					this.convenioIdFlag = convenioId;
				}
			}); 
		}
	
		isEditionFlag = false;
		empresaIdFlag = null;
		convenioIdFlag = null;

} 