import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { CorrespondenciaService } from '@app/services/empresa/convenios/alta-wizard/componentes/correspondencia.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { SimpleDTO } from '@app/models/simple.model';
import { Subscription, BehaviorSubject } from 'rxjs';
import { FormasDePagoService } from '@app/services/empresa/convenios/alta-wizard/componentes/formas-de-pago.service';
import { EnvioCorrespondenciaDTO } from '@app/models/envio-correspondencia.model';

@Component({
	selector: 'detalle-correspondencia',
	templateUrl: './detalle-correspondencia.component.html',
	styleUrls: ['./detalle-correspondencia.component.scss']
})
export class DetalleCorrespondenciaComponent implements OnInit {
	
	private _empresaId = new BehaviorSubject<number>(0);
	private _convenioId = new BehaviorSubject<number>(0);


	constructor(private _fb: FormBuilder,
				private correspondenciaService: CorrespondenciaService,
				private formasDePagoService: FormasDePagoService) { }

	@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
	  this.paginator = mp;
	  this.correspondenciaDataSource.paginator = this.paginator;
	} private paginator: MatPaginator;

	@Input() set isEdition(isEdition) {
		this.isEditionFlag = isEdition;
	} 
	
	isEditionFlag = false;

	@Input() set empresaId(empresaId) {
		this._empresaId.next(empresaId);
		this.empresaIdFlag = empresaId;
	} 
	
	empresaIdFlag = null;
	  
	@Input() set convenioId(convenioId) {
		this._convenioId.next(convenioId);
		this.convenioIdFlag = convenioId;
	} 

	convenioIdFlag = null;	

	correspondenciaServiceSubject: Subscription;
	correspondenciaForm: FormGroup;
	
	correspondenciaDataSource = new MatTableDataSource<any>([]);
	envioCorrespondenciaItem : EnvioCorrespondenciaDTO;
	destino = '';
	formasPago = '';
	tipoEnvio = '';

	ngOnInit() {
	  this.formasDePagoService.getListarFormasDePago()
	  .subscribe(res => this.formasPagoList = res);

      this.correspondenciaForm = this._fb.group({
		destino: [''],
		formaPago: [''],
		tipoEnvio: [''],
		empresaId: [''],
		convenioId: ['']
	  });
		this._convenioId.subscribe(x => {
	  this.correspondenciaService.getCorrespondenciaD(x)
		.subscribe(res => this.correspondenciaDataSource.data = res)
		});
	}

	correspondenciaDisplayedColumns = [
	  'destino',
	  'formas_pago',
	  'tipo_envio',
	  'delete'
	];

	correspondenciaSaveAndRender() {

	  if (this.correspondenciaForm.valid) {
	    this.envioCorrespondenciaItem = this.correspondenciaForm.value as EnvioCorrespondenciaDTO;
			//this.envioCorrespondenciaItem.convenioId = this.convenioIdFlag;
			this.envioCorrespondenciaItem.empresaId = this.convenioIdFlag;
			
			console.log(this.envioCorrespondenciaItem);
			this.correspondenciaService.addCorrespondenciaD(this.envioCorrespondenciaItem)
				.subscribe(res => {
		  			this.correspondenciaService.getCorrespondenciaD(this.convenioIdFlag)
		  			.subscribe(res => { this.correspondenciaDataSource.data = res; });
				});
	  }
	}

	correspondenciaDelete(row) {
	  this.correspondenciaService.deleteCorrespondenciaD(row)
	  .subscribe(res => {
		this.correspondenciaService.getCorrespondenciaD(this.convenioIdFlag)
		.subscribe(res => {
		  if (res == null) res = [];
		  this.correspondenciaDataSource.data = res
		});
	  });
	}

	destinoList: { id: string, descripcion: string }[] = [
	  { id: "A", descripcion: "Domicilio" },
	  { id: "E", descripcion: "Entidad" }
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
}  