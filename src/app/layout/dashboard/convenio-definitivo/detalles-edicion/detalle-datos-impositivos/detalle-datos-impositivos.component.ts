import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { DatosImpositivosService } from '@app/services/empresa/convenios/alta-wizard/componentes/datos-impositivos.service';
import { SimpleDTO } from '@app/models/simple.model';
import { Subscription, BehaviorSubject } from 'rxjs';
import { DatosImpositivosDTO } from '@app/models/datos-impositivos.model';

@Component({
    selector: 'detalle-datos-impositivos',
		templateUrl: './detalle-datos-impositivos.component.html',
		styleUrls: ['./detalle-datos-impositivos.component.scss']
  })
export class DetalleDatosImpositivosComponent implements OnInit {
  
  constructor(private _fb: FormBuilder, 
              private datosImpositivosService: DatosImpositivosService) { 
  }
  
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.datosImpositivosDataSource.paginator = this.paginator;
  } private paginator: MatPaginator;

  @Input() set isEdition(isEdition) {
    setTimeout(() => { 
      this.isEditionFlag = isEdition;
    });
  } isEditionFlag = false;

  @Input() set empresaId(empresaId) {
    setTimeout(() => {
      this.empresaIdFlag = empresaId;
    });
  } empresaIdFlag = null;

  @Input() set convenioId(convenioId) {
    setTimeout(() => {
      this.convenioIdFlag = convenioId;		
      this.fillDatosImpositivos();
    }); 
  } convenioIdFlag = null;

  datosImpositivosForm: FormGroup;
  
  datosImpositivosList: any = [];

  datosImpositivosDataSource = new MatTableDataSource<any>([]);
  datosImpositivos_displayedColumns = [
    'modalidadImpresion',
    'empresasFacturan',
    'tipoComprobante'
  ];

  
  empresasFacturan = '';
  modalidadImpresion = '';
  tipoComprobante = '';

  datosImpositivoItem : DatosImpositivosDTO;

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

  isPosting = false;

  ngOnInit() {
    this.datosImpositivosService.getEmpresasQueFacturanD()
    .subscribe(res => {
      if (res == null)  res = [];
      this.empresasFacturanList = res
    });

    this.datosImpositivosForm = this._fb.group({
      modalidad: [''],
      facturadoraId:[''],
      tipoComprobante:['']
    });
  }

  fillDatosImpositivos() {
    this.datosImpositivosService.getDatosImpositivosD(this.convenioIdFlag)
    .subscribe(res => {
      if (res == null) res = [];
      this.datosImpositivosDataSource.data = res;
    });
  }

  datosImpositivosSaveAndRender() {
    if (this.datosImpositivosForm.valid) {
      this.datosImpositivoItem = this.datosImpositivosForm.value as DatosImpositivosDTO;
      this.datosImpositivoItem.empresaId = this.empresaIdFlag;
      this.datosImpositivoItem.convenioId = this.convenioIdFlag;

      this.datosImpositivosService.addDatosImpositivosD(this.datosImpositivoItem)
      .subscribe(res => {
        this.fillDatosImpositivos();      
      });
    }

    this.datosImpositivosForm
    .reset({
      modalidadImpresion: '', 
      empresasFacturan: '', 
      tipoComprobante: ''
    });
  }

  datosImpositivosDelete(row) {
    this.datosImpositivosService.deleteDatosImpositivosD(row)
    .subscribe( () => this.fillDatosImpositivos())
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
}