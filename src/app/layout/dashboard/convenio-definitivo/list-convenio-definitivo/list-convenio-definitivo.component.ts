import { Component, OnInit, ViewChild, AfterViewChecked, HostListener, ViewChildren, QueryList } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import 'rxjs/add/operator/debounceTime';
import { Router, ActivatedRoute } from '@angular/router';
import { ConvenioDefinitivoService } from '@app/services/convenio-definitivo/convenio-definitivo.service';
import { UtilService } from '@app/core';
import { LoadingDirective } from '@app/shared/loading.directive';
import { variable } from '@angular/compiler/src/output/output_ast';
@Component({
	selector: 'app-list-convenio-definitivo',
	templateUrl: './list-convenio-definitivo.component.html',
	styleUrls: ['./list-convenio-definitivo.component.scss']
})
export class ListConvenioDefinitivoComponent implements OnInit {

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private service: ConvenioDefinitivoService,
		private utilService: UtilService
	) {

		this.empresaId = this.activatedRoute.snapshot.params.empresaId || null;

		this.titleText = (this.empresaId) ? `Empresa Nro. ${this.empresaId}` : 'Listado de convenios definitivos';
		this.noResultText = (this.empresaId) ? `No existen convenios definitivos para esta empresa.` : 'No se encontraron convenios definitivos.';

		this.fillTable();
		this.getScreenSize();
	}

	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	@ViewChildren(LoadingDirective) loadings: QueryList<LoadingDirective>;

	empresaId;

	titleText = '';
	noResultText = ''

	hiddenToolTip = false;

	displayedColumns = ['id', 'nombre', 'vigenciaDesde', 'fecha_hasta', 'seleccionar'];

	dataSource = new MatTableDataSource<any>([]);

	controlsLoading: any = {
		list: {
			isLoading: true,
			descripcion: 'list',
			type: 'table'
		},
		table: {
			isLoading: false,
			descripcion: 'table',
			type: 'table'
		}
	};


	redirectToDetails($event: any, source: string, empresaId: any) {
		$event.stopPropagation();
		let convenioId = 'NotProvided';

		switch (source) {
			case 'btn':
				convenioId = $event.currentTarget.id;
				break;
			case 'row':
				convenioId = $event.path[1].id;
				break;
		}

		this.router.navigate([`/conveniosdefinitivos/empresa/${empresaId}/detalles/${convenioId}`]);
	}

	redirectToAdd() {
		this.router.navigate([`/conveniostemporales/empresa/${this.empresaId}/alta`]);
	}

	trackById(index, item) {
		return item._id;
	}

	renderData(rerender = false) {
		if (rerender) {
			this.dataSource = new MatTableDataSource<any>([]);
			this.dataSource.paginator = this.paginator;
			return false;
		} else {
			setTimeout(() => {
				this.dataSource.paginator = this.paginator;
				this.dataSource.paginator._intl.itemsPerPageLabel = 'Filas por página';
			});

			this.dataSource.sort = this.sort;
		}
	}

	@HostListener('window:resize', ['$event'])
	getScreenSize(event?) {
		if (window.innerWidth <= 960) {
			this.hiddenToolTip = true;
			if (this.displayedColumns[this.displayedColumns.length - 1] !== 'seleccionar') {
				this.displayedColumns.push('seleccionar');
				this.renderData(true);
			}
		} else {
			this.hiddenToolTip = false;
			if (this.displayedColumns[this.displayedColumns.length - 1] === 'seleccionar') {
				this.displayedColumns.pop();
				this.renderData(true);
			}
		}
	}

	// Filtro contra backend
	fillTableFilter(val) {
		this.utilService.setControlsLoadingState('table', true, this.loadings);
		this.service.getConveniosDefinitivos(val, '', '').debounceTime(300).subscribe(
			r => {
				if (r) {
					this.dataSource.data = r;
					this.renderData(false);
				}
				else this.dataSource.data = [];

			}).add(() => {
				this.utilService.setControlsLoadingState('table', false, this.loadings);
			});
	}

	// applyFilter(filterValue: string) {
	// 	this.dataSource.filter = filterValue.trim().toLowerCase();

	// 	if (this.dataSource.paginator) {
	// 		this.dataSource.paginator.firstPage();
	// 	}
	// }

	fillTable() {
		let id = (this.empresaId) ? this.empresaId : '';
		this.service.getConveniosDefinitivos('', id, '').subscribe(r => {
			if (r) {
				this.dataSource.data = r;
				this.renderData(false);
			}
		}).add(() => {
			this.utilService.setControlsLoadingState('list', false, this.loadings);
		});
	}

	ngOnInit() {
		this.renderData(true);
	}

}
