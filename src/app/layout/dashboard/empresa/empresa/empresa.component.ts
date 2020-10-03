import { Component, OnInit, Output, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { EmpresaService } from '@app/services/empresa/empresa.service';
import { EmpresaDTO } from '@app/models/empresa/empresa.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatMenuTrigger, MatDialog, MatPaginator } from '@angular/material';
import { ActividadAfipDTO } from '@app/models/empresa/actividad-afip.model';
import { LoadingDirective } from '@app/shared/loading.directive';
import { UtilService } from '@app/core';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {

  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;

  constructor(private empresaService: EmpresaService,
    public dialog: MatDialog,
    private utilService: UtilService) {

    if (localStorage.getItem('actividades') == null) {
      this.empresaService.obtenerActividadesEmpresa().subscribe(
        res => {
          localStorage.setItem('actividades', JSON.stringify(res));
        }
      )
    }
  }

  actividades: ActividadAfipDTO[] = [];

  displayedColumns: string[] = ['cuit', 'razonSocial', 'nombreFantasia', 'id', 'acciones'];
  empresas: EmpresaDTO[] = [];
  selectedEmpresas = new SelectionModel<EmpresaDTO>(true, []);
  dataSource = new MatTableDataSource<EmpresaDTO>(this.empresas);
  resultsLength = 0;

  controlsLoading: any = {
    table: {
      isLoading: false,
      descripcion: 'table',
      type: 'table'
    }
  };

  private paginator: MatPaginator;

  @ViewChildren(LoadingDirective) loadings: QueryList<LoadingDirective>;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  buscarEmpresa(searchTerm: any) {
    searchTerm = String(searchTerm).trim();
    this.utilService.setControlsLoadingState('table', true, this.loadings);
    this.empresaService.searchEmpresas(searchTerm)
      .subscribe(
        res => {
          this.empresas = res;
          this.dataSource.data = this.empresas;
          this.resultsLength = this.empresas.length;
        }, error => {
          this.empresas = [];
          this.dataSource.data = this.empresas;
          this.resultsLength = this.empresas.length;
        })
      .add(() => {
        this.utilService.setControlsLoadingState('table', false, this.loadings);
      });
  }

  ngOnInit() {
    setTimeout(() => {
      this.buscarEmpresa('');
    });
  }
}
