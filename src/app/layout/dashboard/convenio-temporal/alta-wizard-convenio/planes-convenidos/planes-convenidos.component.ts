import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { PlanesConvenidosService } from '@app/services/empresa/convenios/alta-wizard/componentes/planes-convenidos.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CabeceraConvenioDTO } from '@app/models/cabecera-convenio.model';
import { PlanConvenidoDTO } from '@app/models/planes-convenidos.model';
import { EmpresaDTO } from '@app/models/empresa/empresa.model';
import { PlanDTO } from '@app/models/plan.model';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { SubsidiosService } from '@app/services/empresa/convenios/alta-wizard/componentes/subsidios.service';
import { ProductoDTO } from '@app/models/producto.model';
import { MaestroPlanDTO } from '@app/models/maestro-plan.model';
import { UtilService } from '@app/core';

@Component({
	selector: 'app-planes-convenidos',
	templateUrl: './planes-convenidos.component.html',
	styleUrls: ['./planes-convenidos.component.scss']
})
export class PlanesConvenidosComponent implements OnInit {

	isEditionFlag = false;
	empresaIdFlag = null;
	convenioIdFlag = null;
	planesConvenidosForm: FormGroup;
	private _convenioId = new BehaviorSubject<number>(0);
	cabeceraDataSource = new MatTableDataSource<any>([]);
	productoCtrl = new FormControl();
	filteredProductos: Observable<any[]>;
	planesList: PlanDTO[];
	productosList: ProductoDTO[];
	cabeceraConvenio: CabeceraConvenioDTO;
  dialogRef = null;

	constructor(private _fb: FormBuilder,
		private planesConvenidosService: PlanesConvenidosService,
    private subsidiosService: SubsidiosService,
    private utilService: UtilService) {
	}

	ngOnInit(): void {

		this.planesConvenidosService.getProductosPlanesConvenidos().subscribe(
			result => {
				this.productosList = result["listaResultado"];
			}
		)


		this._convenioId.subscribe(x => {
			this.planesConvenidosService.getCabeceraConvenio(x).subscribe(
				res => {
					console.log(res);
					if(res != null && res[0]){
						this.cabeceraConvenio = res[0];
						this.planesConvenidosService.getPlanesConvenidos(res[0].id).subscribe(
							res => {
								if(res==null){
									res = [];
								}
								this.cabeceraDataSource.data = res;
							}
						)
				    }
				}
			)
		});

		this.filteredProductos = this.productoCtrl.valueChanges.pipe(
			startWith(''),
			//debounceTime(300),
			switchMap(value => {

				if (typeof value === "object") {
					value = this.productoCtrl.value.descripcion;
				}
				if (value !== '') {
					return this.lookup(value);
				} else {
					return of(null);
				}
			})

		)

		this.planesConvenidosForm = this._fb.group({
			cantMeses: [''],
			porcentaje: [''],
			bonificacionRecaudo: [''],
			porcentajeBonificacion: [''],
			producto:['', [Validators.required]],
			plan: ['', [Validators.required]]
		});

	}

	lookup(value: string): Observable<ProductoDTO[]> {
		return this.subsidiosService.getListaProductos(value.toLowerCase()).pipe(
			map(results => results["listaResultado"]),
			catchError(_ => {
				return of(null);
			})
		);
  }

	onEnter(evt: any) {

		if (evt.source.selected) {

			let codigo = evt.source.value.codigo;
			console.log(codigo);
			this.subsidiosService.getListaPlanesByProducto(codigo).subscribe(
				result => {
					console.log(result);
					this.planesList = result["listaResultado"];
				}
			)
		}
	}
	//cabeceraList: any = [];
	cabeceraDisplayedColumns = [
		'planDescripcion',
		'producto',
		'delete'
	];

	bonificacionRecaudoList: { id: string, descripcion: string }[] = [
		{ id: "", "descripcion": "-- Seleccionar --" },
		{ id: "B", "descripcion": "Bonificacion" },
		{ id: "R", "descripcion": "Recaudo" }
	];

	changeBonificacionRecaudo(data) {
		this.bonificacionRecaudo = data.value;
	}

	bonificacionRecaudo = '';

	cantGruposDTO = '';
	cantIntegrantes = '';
	porcentaje = '';
	vigenciaDesde = '';
	vigenciaHasta = '';


	planesCabeceraSaveAndRender() {

		if (this.planesConvenidosForm.valid) {

      this.isPosting = true;

			let planConvenido = new PlanConvenidoDTO();
			//console.log(this.planesConvenidosForm.value["producto"]["codigo"]);
			planConvenido.producto = this.planesConvenidosForm.value["producto"]["codigo"];
			planConvenido.cantidadMeses = 0;//this.planesConvenidosForm.value["cantMeses"];
			planConvenido.plan = new MaestroPlanDTO();
			planConvenido.plan.codigo = this.planesConvenidosForm.value["plan"]["codigo"];
			planConvenido.plan.descripcion = this.planesConvenidosForm.value["plan"]["descripcionParaSocio"];
			planConvenido.porcentaje = 0;//this.planesConvenidosForm.value["porcentaje"];
			planConvenido.porcentajeBonificacion = 0;// this.planesConvenidosForm.value["porcentajeBonificacion"];
			planConvenido.bonificacionRecaudo = 'B'; //this.planesConvenidosForm.value["bonificacionRecaudo"];
			planConvenido.vigencia = new Date() ;

			if (this.cabeceraConvenio == null) {
				/*Si no tiene cabecera le creo una*/
				let empresa = new EmpresaDTO();
				empresa.id = this.empresaIdFlag;
				let cabecera = new CabeceraConvenioDTO();
				cabecera.empresa = empresa;
				cabecera.idConvenio = this.convenioIdFlag;
				cabecera.cantidadGruposParaBonificar = 1;
				cabecera.porcentaje = 0;
				cabecera.cantidadIntegrantesParaBonificar = 1;
				cabecera.vigencia =new Date();

        this.planesConvenidosService.addCabeceraConvenio(cabecera)
        .subscribe(res => {
          this.planesConvenidosService.getCabeceraConvenio(this.convenioIdFlag)
          .subscribe(res => {
					  this.cabeceraConvenio = res[0];
            planConvenido.cabecera = this.cabeceraConvenio;
            this.planesConvenidosService.addPlanConvenido(planConvenido)
            .subscribe(res => {
              this.utilService.notification('Registro añadido', 'success', 4000);
              this.planesConvenidosService.getPlanesConvenidos(this.cabeceraConvenio.id)
              .subscribe(res => {
                if (res == null) res = [];
                this.cabeceraDataSource.data = res;
              });
            }).add(() => {
              this.isPosting = false;
            });
          });
        });
			} else {
				planConvenido.cabecera = this.cabeceraConvenio;
        this.planesConvenidosService.addPlanConvenido(planConvenido)
        .subscribe(res => {
					this.utilService.notification('Registro añadido', 'success', 4000);
          this.planesConvenidosService.getPlanesConvenidos(this.cabeceraConvenio.id)
          .subscribe(res => {
            if (res == null) res = [];

            this.cabeceraDataSource.data = res;
          });
        }).add(() => {
          this.isPosting = false;
        });
			}
		}
	}

	planesCabeceraDelete(row) {

    if (this.dialogRef === null) {
			this.dialogRef = this.utilService.openConfirmDialog({
				titulo: 'Dialogo de confirmación',
				texto: '¿Desea eliminar este registro de plan convenido?',
				confirmar: 'Eliminar',
				cancelar: 'Cancelar'
      });

      this.utilService.loseFocus();

			this.dialogRef.afterClosed().toPromise().then((respuesta) => {

        if (respuesta) {

          this.isPosting = true;

          this.planesConvenidosService.deletePlanesConvenidos(row)
          .subscribe(res => {
            this.planesConvenidosService.getCabeceraConvenio(this.convenioIdFlag)
            .subscribe(res => {
              this.utilService.notification('Registro eliminado', 'success', 4000);
              this.planesConvenidosService.getPlanesConvenidos(res[0].id)
              .subscribe(res => {
                if (res == null) res = [];

                this.cabeceraDataSource.data = res
              });
            }).add(() => {
              this.isPosting = false;
            });
          });
        }

				this.dialogRef = null;
			});
		}
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

	@Input() set empresaId(empresaId) {
		setTimeout(() => {
			this.empresaIdFlag = empresaId;
		});
  }
  
	@Input() set isEdition(isEdition) {
		setTimeout(() => {
			this.isEditionFlag = isEdition;
		});
	}

	@Input() set convenioId(convenioId) {
		this._convenioId.next(convenioId);
		setTimeout(() => {
			this.convenioIdFlag = convenioId;
		});
  }
  
  isPosting = false;
}
