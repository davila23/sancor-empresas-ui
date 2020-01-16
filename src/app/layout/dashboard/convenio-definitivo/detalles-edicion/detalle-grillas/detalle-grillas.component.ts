import { Component, OnDestroy, OnInit, EventEmitter, Output, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { GrillaEmpresaService } from '@app/services/empresa/convenios/alta-wizard/componentes/grilla-empresa.service';
import { BehaviorSubject } from 'rxjs';
import { GrillaProductoDTO } from '@app/models/grilla-producto.model';
import { ProductoGrillaEmpresaDTO } from '@app/models/producto-grilla-empresa.model';
import { ProductoDTO } from '@app/models/producto.model';
import { GrillaDTO } from '@app/models/grilla.model';
import { EmpresaDTO } from '@app/models/empresa/empresa.model';
import { ConvenioDTO } from '@app/models/convenio-temporal/convenio.model';
import { UtilService } from '@app/core';


@Component({
	selector: 'detalle-grillas',
	templateUrl: './detalle-grillas.component.html',
	styleUrls: ['./detalle-grillas.component.scss']
})
export class DetalleGrillasComponent implements OnInit {

  constructor(private _fb: FormBuilder,
    private grillaEmpresaService: GrillaEmpresaService,
    private utilService: UtilService) {

    this.grillasForm = this._fb.group({
      seleccion: ['', [Validators.required]],
      nroGrilla: ['', Validators.required]
    });
  }

	isEditionFlag = false;
	empresaIdFlag = null;
	convenioIdFlag = null;
	grillasForm: FormGroup;
	private _convenioId = new BehaviorSubject<number>(0);
	grillasDataSource = new MatTableDataSource<any>([]);
	grillasProductoDataSource = new MatTableDataSource<any>([]);
	grillaProductos: any[] = [];

  isPosting = false;

	private paginator: MatPaginator;

	@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
		this.paginator = mp;
		this.grillasProductoDataSource.paginator = this.paginator;
	}

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

	@Input() set convenioId(convenioId) {
    setTimeout(() => {
      this.convenioIdFlag = convenioId;	
      this.fillGrillas();
    });
	}

	ngOnInit(): void { }

  fillGrillas() {
    this.grillaEmpresaService.getAllGrillasD(this.convenioIdFlag)
    .subscribe(res => {
      if (res == null) res = [];

      this.grillasProductoDataSource.data = res;
    });
  }

	caracteristicas_list = [
		{ id: 2, caracteristica: 'Nuevas Pymes', nroGrilla: 1111, descripcion: 'Descripción no editable', tipo: "PYME" },
		//{ id: 2, caracteristica: 'Negocios especiales', nroGrilla: 2222, descripcion: 'Descripción no editable', tipo: 'NEGOCIOESP' },
		//{ id: 3, caracteristica: 'TC/CBU', nroGrilla: 3333, descripcion: 'Descripción no editable', tipo: 'TC-CBU' }
		{ id: 4, caracteristica: 'Comunes', nroGrilla: 4444, descripcion: 'Descripción no editable', tipo: 'COMUN' },
		//{ id: 5, caracteristica: 'Afinidad', nroGrilla: 5555, descripcion: 'Descripción no editable', tipo: 'AFINIDAD' },
		{ id: 6, caracteristica: 'Especiales', nroGrilla: 6666, descripcion: 'Descripción no editable', tipo: 'ESPECIAL' }
	];


	grillas_displayedColumns = [
		'descripcion'
	];

	grillasProducto_displayedColumns = [
		'idGrilla',
		'grilla'
	];


	grillasSaveAndRender() {
  
    this.isPosting = true;

    let pge = new ProductoGrillaEmpresaDTO();

    let convenio = new ConvenioDTO();
    convenio.id = Number(this.convenioIdFlag);
    pge.convenio = convenio;
    
    let grilla = new GrillaDTO();
    grilla.caracteristicas = this.caracteristicaElegida.id;

    if (this.nrogrillaSelected) grilla.nrogrilla = this.nrogrillaSelected;
    else grilla.nrogrilla = this.grillasForm.get('nroGrilla').value;
    

    pge.grilla = grilla;


    console.log(pge);

    this.grillaEmpresaService.addGrillaConvenioProductoD(pge)
    .subscribe(res => {
      this.fillGrillas();
    }).add(() => {
      this.isPosting = false;
    });
	}

	grillasDelete(row) {
		
		let grillaId = row["grilla"]["nrogrilla"];
		let convenioId = row["convenio"]["id"];
		let productId = row["producto"]["codigo"];

    this.grillaEmpresaService.deleteGrillaConvenioProductoD(grillaId, convenioId, productId)
    .subscribe(res => {
      this.fillGrillas();
    });
	}

	nrogrillaSelected: any;
	caracteristicaSelected: number;

	applyFilter(event: any) {
		event.preventDefault();

		if (event.key === 'Enter') {
			if (this.caracteristicaSelected) {
				this.nrogrillaSelected = event.target.value;
        this.grillaEmpresaService.getGrillasPorNroGrilla(event.target.value)
        .subscribe(res => {
          this.grillasDataSource.data = res;
        });
			}
		}
	}

	caracteristicaElegida:any;

	patchNroGrilla(caracteristica: any) {
	
		this.caracteristicaElegida = caracteristica;
  
    if (caracteristica.tipo != 'ESPECIAL') {
      this.grillaEmpresaService.getGrillasPorCaracteristica(caracteristica.tipo)
      .subscribe(res => {
        if (res == null) res = [];
          
        this.grillaProductos = res;
        let unique = Array.from(new Set(res.map((item: any) => item.descripcion)));
        this.grillasDataSource.data = unique;
      });
    } else {
      this.caracteristicaSelected = 5;
    }

		this.grillasForm.patchValue({ nroGrilla: caracteristica.nroGrilla });
	}
}
