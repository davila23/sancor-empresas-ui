import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { CorrespondenciaService } from '@app/services/empresa/convenios/alta-wizard/componentes/correspondencia.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { SimpleDTO } from '@app/models/simple.model';
import { Subscription } from 'rxjs';
import { FormasDePagoService } from '@app/services/empresa/convenios/alta-wizard/componentes/formas-de-pago.service';
import { EnvioCorrespondenciaDTO } from '@app/models/envio-correspondencia.model';

@Component({
	selector: 'app-correspondencia',
	templateUrl: './correspondencia.component.html',
	styleUrls: ['./correspondencia.component.scss']
})
export class CorrespondenciaComponent implements OnInit {

	correspondenciaServiceSubject: Subscription;
	correspondenciaForm: FormGroup;
	isEditionFlag = false;
	empresaIdFlag = null;
	convenioIdFlag = null;
	private paginator: MatPaginator;
	correspondenciaDataSource = new MatTableDataSource<any>([]);
	envioCorrespondenciaItem : EnvioCorrespondenciaDTO;
	destino = '';
	formasPago = '';
	tipoEnvio = '';


	constructor(private _fb: FormBuilder,
		        private correspondenciaService: CorrespondenciaService,
		        private formasDePagoService: FormasDePagoService) {
	}
 
	ngOnInit() {
			this.formasDePagoService.getListarFormasDePago().subscribe(
				res => this.formasPagoList = res
			)

      this.correspondenciaForm = this._fb.group({
					destino: [''],
					formaPago: [''],
					tipoEnvio: [''],
					empresaId: [''],
          convenioId: ['']
		});
		
		this.correspondenciaService.getCorrespondencia(this.convenioIdFlag).subscribe(
		     res => {
				if(res==null){
					res = [];
				}
				 this.correspondenciaDataSource.data = res 
			 }
	  )
	}

	@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
			this.paginator = mp;
			this.correspondenciaDataSource.paginator = this.paginator;
	}

	correspondenciaDisplayedColumns = [
		'destino',
		'formas_pago',
		'tipo_envio',
		'delete'
	];

	correspondenciaSaveAndRender() {
		
		if(this.correspondenciaForm.valid){
			this.envioCorrespondenciaItem = this.correspondenciaForm.value as EnvioCorrespondenciaDTO;
			this.envioCorrespondenciaItem.convenioId = this.convenioIdFlag;
			this.correspondenciaService.addCorrespondencia(this.envioCorrespondenciaItem).subscribe(
				res=>{
					this.correspondenciaService.getCorrespondencia(this.convenioIdFlag).subscribe(
					  res => {
							if(res==null){
								res = [];
							}
							this.correspondenciaDataSource.data = res;
						}
					)
				}
			)
		}
	}

	correspondenciaDelete(row) {
		this.correspondenciaService.deleteCorrespondencia(row).subscribe(
       	res=>{
				 this.correspondenciaService.getCorrespondencia(this.convenioIdFlag).subscribe(
					res => {
					
						if(res==null){
							res = [];
						}
						this.correspondenciaDataSource.data = res
				    }
				 )
			 }
		);
	}

	destinoList: { id: string, descripcion: string }[] = [
		{ id: "A", descripcion: "Asociado" },
		{ id: "E", descripcion: "Empresa" }
	];

	formasPagoList: SimpleDTO[];

	tipoEnviosList: { id: number, descripcion: string }[] = [
		{ id: 1, descripcion: "Mail" },
		{ id: 2, descripcion: "Correspondencia" }
	];

	changeDestino(data) {
		this.destino = data.value;
	}
	changeFormasPago(data) {
		this.formasPago = data.value;
	}
	changeTiposEnvios(data) {
		this.tipoEnvio = data.value;
	}

	@Output() setForms: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();


	@Input() set isEdition(isEdition) {
		setTimeout(() => {
			if (isEdition) {
				/*
        let x = this._dataTransferService.value as FormGroup;
        if (x) {
          this.datosGeneralesForm.setValue(x.getRawValue());
        } else {
          this.fillForm();
        }*/
			}
			this.isEditionFlag = isEdition;
		});
	}

	@Input() set empresaId(empresaId) {
		//setTimeout(() => {
			// this.datosGeneralesForm.patchValue({empresa: {id: Number(empresaId)}}); 
			this.empresaIdFlag = empresaId;
		//});
	}

	@Input() set convenioId(convenioId) {
		//setTimeout(() => {
			//if (this.isEditionFlag) {
				this.convenioIdFlag = convenioId;
			//}
	//	});
	}
	
}  