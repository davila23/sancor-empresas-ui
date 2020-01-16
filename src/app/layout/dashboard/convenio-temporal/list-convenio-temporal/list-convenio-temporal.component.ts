import { Component, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { ConvenioTemporalDTO } from '@app/models/convenio-temporal/convenio-temporal.model';
import { ConvenioTemporalService } from '@app/services/convenio-temporal/convenio-temporal.service';
import { DataSource } from '@angular/cdk/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { UtilService } from '@app/core';
import { LoadingDirective } from '@app/shared/loading.directive';

@Component({
  selector: 'app-list-convenio-temporal',
  templateUrl: './list-convenio-temporal.component.html',
  styleUrls: ['./list-convenio-temporal.component.scss']
})
export class ListConvenioTemporalComponent implements OnInit { 

  constructor(private convenioTemporalService: ConvenioTemporalService, 
              private utilService: UtilService,
              private router: Router) { }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }; private paginator: MatPaginator;

  @ViewChildren(LoadingDirective) loadings: QueryList<LoadingDirective>;

  displayedColumns:  string[] = ['empresa', 'convenio', 'fechaDesde', 'estado', 'observaciones'];
  conveniosTemporales: ConvenioTemporalDTO[] = [];
  selectedConveniosTemporales = new SelectionModel<ConvenioTemporalDTO>(true, []);
  dataSource = new MatTableDataSource<ConvenioTemporalDTO>(this.conveniosTemporales);
  resultsLength = 0;            

  controlsLoading: any = {
    list: {
      isLoading: true,
      descripcion: 'list',
      type: 'table'
    }
  };

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  redirectToDetails(value) {
    let estado = value.estadoControlDescripcion;

    if (estado && estado == 'CONTROL') {
      this.utilService.notification('Para acceder a este convenio debe ingresar por convenios en control.', 'warning', 4000);
      return false;
    }

    this.router.navigate([`/conveniostemporales/empresa/${value.empresaId}/edicion/${value.id}`]);
  }

	ngOnInit() {
    this.convenioTemporalService.getConveniosTemporalesByUser().subscribe(
      res => {
        if (res == null) res = [];

        this.conveniosTemporales = res;
        this.dataSource.data = this.conveniosTemporales;
        this.resultsLength = this.conveniosTemporales.length;
        this.utilService.setControlsLoadingState('list', false, this.loadings);
      }
    )
	}
}
