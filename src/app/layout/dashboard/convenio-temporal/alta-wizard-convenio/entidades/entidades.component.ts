import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EntidadesService } from '@app/services/empresa/convenios/alta-wizard/componentes/entidades.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { RelacionEmpresaConFacturadoraDTO } from '@app/models/relacion-empresa.model';
import { EmpresaDTO } from '@app/models/empresa/empresa.model';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { UtilService } from '@app/core';

@Component({
	selector: 'app-entidades',
	templateUrl: './entidades.component.html',
	styleUrls: ['./entidades.component.scss']
})
export class EntidadesComponent implements OnInit {

	entidadesForm: FormGroup;
	entidadDataSource = new MatTableDataSource<any>([]);
	entidadrelacion = new RelacionEmpresaConFacturadoraDTO();
	empresaCtrl = new FormControl('', Validators.required);
	filteredEmpresas: Observable<any[]>;
	
	constructor(private _fb: FormBuilder, 
              private entidadesService: EntidadesService,
              private utilService: UtilService) { 
	}
	
	@Output() setForms: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.entidadDataSource.paginator = this.paginator;
  }; private paginator: MatPaginator;

	@Input() set isEdition(isEdition) {
	  setTimeout(() => {
		this.isEditionFlag = isEdition;
	  });
	}

	@Input() set empresaId(empresaId) {
	  setTimeout(() => {
      this.empresaIdFlag = empresaId;
	  });
	}

  @Input() set isAllowedToEdit(boolean) {
    setTimeout( () => {
      this.edit = boolean;
    });
  } edit = false;

  @Input() set isAllowedToDelete(boolean) {
    setTimeout(() => {
      this.delete = boolean;
    });
  } delete = false;

	@Input() set convenioId(convenioId) {
	  setTimeout(() => {
      if (this.isEditionFlag) {
        this.convenioIdFlag = convenioId;
        this.fillEntidades();
      }
	  });
	}

	isEditionFlag = false;
	empresaIdFlag = null;
	convenioIdFlag = null;
	empresaRelacionada = new EmpresaDTO;
  dialogRef = null;

	ngOnInit() {
	  this.entidadesForm = this._fb.group({
      nro_empresa: ['', Validators.required],
      cuit: [''],
      descripcion: [''],
      empresa: [''],
    });
    
	  this.filteredEmpresas = this.empresaCtrl.valueChanges.pipe(
		startWith(''),
		switchMap(value => {
		  if (typeof value === "object") value = this.entidadesForm.value.descripcion;
			  
		  if (value !== '' && value !== null) return this.lookup(value);
		  else return of(null);
		
	  }));
	}

	onEnter(evt: any) {
	  if (evt.source.selected) {
		this.empresaCtrl.setValue(evt.source.value.descripcion);
		this.entidadesForm.controls['cuit'].setValue(evt.source.value.cuit);
		this.entidadesForm.controls['nro_empresa'].setValue(evt.source.value.id);
		this.entidadesForm.controls['empresa'].setValue(evt.source.value);
	  }
	}

	lookup(value: string): Observable<EmpresaDTO[]> {
	  return this.entidadesService.getEmpresasAutocomplete(value.toLowerCase()).pipe(
		map(results => results),
		catchError( res => {
		  return of(null);
		}));
	}

	entidad_displayedColumns = [
	  'nro_empresa',
	  'cuit',
	  'descripcion',
	  'delete'
	];

  isPosting = false;
	
	entidadSaveAndRender() {
	  if (this.entidadesForm.valid) {

      this.isPosting = true;

	    let empresaFacturadora = new EmpresaDTO;
	    empresaFacturadora.id = Number(this.convenioIdFlag);
		
	    this.entidadrelacion.empresaFacturadura = empresaFacturadora;
        this.entidadrelacion.empresaRelacionada = this.entidadesForm.value['empresa'];
	    //PASAR DEL FORM A LA RELACION	
	    this.entidadesService.addEntidades(this.entidadrelacion)
	    .subscribe(res => {
        this.utilService.notification('Registro añadido', 'success',  4000);  
        this.fillEntidades();
        this.entidadesForm.reset();
        this.empresaCtrl.reset();
        this.empresaCtrl.markAsUntouched();
        this.empresaCtrl.markAsPristine();
	    }).add(() => {
        this.isPosting = false;
      });
	  }
	}

  fillEntidades() {
    this.entidadesService.getEntidadesRelacionadas(this.convenioIdFlag)
      .subscribe(res => {
        if(res==null) res = [];              
        this.entidadDataSource.data = res
    });
  }

	entidadDelete(row) {
    if (this.dialogRef === null) {
			this.dialogRef = this.utilService.openConfirmDialog({
				titulo: 'Dialogo de confirmación',
				texto: '¿Desea eliminar esta empresa relacionada?',
				confirmar: 'Eliminar',
				cancelar: 'Cancelar'
      });
      
      this.utilService.loseFocus();
      
			this.dialogRef.afterClosed().toPromise().then((respuesta) => {
        
        if (respuesta) {
          this.isPosting = true;

          let empresaFacturadora = new EmpresaDTO;
          empresaFacturadora.id = Number(this.convenioIdFlag);
          this.empresaRelacionada = row as EmpresaDTO;
          this.entidadrelacion.empresaRelacionada = this.empresaRelacionada;
          this.entidadrelacion.empresaFacturadura = empresaFacturadora;

          this.entidadesService.deleteRelacionFacturadoraEmpresas(this.entidadrelacion)
          .subscribe(res => {
            this.utilService.notification('Registro eliminado', 'success', 4000);
            this.entidadesService.getEntidadesRelacionadas(this.convenioIdFlag)
            .subscribe(res => {
              if (res == null) res = [];              
              this.entidadDataSource.data = res
            });
          }).add(() => {
            this.isPosting = false;
          });
        }

				this.dialogRef = null;
			});
		}
	}
} 