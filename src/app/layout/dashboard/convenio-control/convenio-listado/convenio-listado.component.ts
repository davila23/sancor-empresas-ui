import { Component, OnInit, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { UtilService } from '@app/core';
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { LoadingDirective } from '@app/shared/loading.directive';
import { SelectionModel } from '@angular/cdk/collections';
import { ControlConvenioService } from '@app/services/control/control-convenio.service';
import { ConvenioMovimientoDTO } from '@app/models/convenio-movimiento.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { delay } from 'rxjs/operators';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-convenio-listado',
  templateUrl: './convenio-listado.component.html',
  styleUrls: ['./convenio-listado.component.scss']
})
export class ConvenioListadoComponent implements OnInit {

  constructor(
    private controlConvenioService: ControlConvenioService,
    private utilService: UtilService,
    private router: Router,
    private fb: FormBuilder) {
      this.filtrosForm = this.fb.group({
        nombre: '',
        usuario: '',
        estado: ['2']
      });
    }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }; private paginator: MatPaginator;

  @ViewChildren(LoadingDirective) loadings: QueryList<LoadingDirective>;

  filtrosForm: FormGroup;

  displayedColumns:  string[] = [
    'nombreConvenio',
    'nombreEmpresa',
    'usuario',
    'fecha',
    'estado'
  ];
  conveniosControl: ConvenioMovimientoDTO[] = [];
  selectedConveniosTemporales = new SelectionModel<ConvenioMovimientoDTO>(true, []);
  dataSource = new MatTableDataSource<ConvenioMovimientoDTO>(this.conveniosControl);
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

  refresh() {
    this.utilService.setControlsLoadingState('list', true, this.loadings);
    this.fillTable(null, JSON.parse("[" + this.filtrosForm.value.estado + "]"));
  }

  fillTable(usuario?: '', estado?: '') {
    this.controlConvenioService.obtenerListaControlConvenio(usuario, estado).pipe(delay(300)).subscribe(r => {
      this.conveniosControl = r;
      this.dataSource.data = this.conveniosControl;
      this.resultsLength = this.conveniosControl.length;
    }).add(() => {
      this.utilService.setControlsLoadingState('list', false, this.loadings);
    });
  }


  redirectToDetails(value) {
    if (value.estado == 'CORRECCION') {
      this.utilService.notification('Por favor corregir este convenio y enviar a control para poder acceder desde esta pantalla.', 'warning', 4000);
      return false;
    }
    this.router.navigate([`/convenioscontrol/convenio/${value.id}`]);
  }

  ngOnInit() {
    this.fillTable(null, JSON.parse("[" + this.filtrosForm.value.estado + "]"));
  }
}
