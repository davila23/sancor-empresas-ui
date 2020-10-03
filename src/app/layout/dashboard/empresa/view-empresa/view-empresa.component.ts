import { Component, OnInit, Inject, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { EmpresaDTO } from '@app/models/empresa/empresa.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EmpresaService } from '@app/services/empresa/empresa.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoadingDirective } from '@app/shared/loading.directive';
import { UtilService } from '@app/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { ResponsableNegocioDTO } from '@app/models/empresa/responsable-negocio.model';

@Component({
  selector: 'app-view-empresa',
  templateUrl: './view-empresa.component.html',
  styleUrls: ['./view-empresa.component.scss']
})
export class ViewEmpresaComponent implements OnInit {

  listaResponsablesDeNegocio = new MatTableDataSource<ResponsableNegocioDTO>([]);
  isPostingRN: boolean = false;
  listaResponsablesDeNegocio_displayedColumns = [
    'nombre',
    'numeroDocumento',
    'comentario'
  ];
  private paginator: MatPaginator;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.listaResponsablesDeNegocio.paginator = this.paginator;
  }

  constructor(private empresaService: EmpresaService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private utilService: UtilService) {
    this.formGroup = this.formBuilder.group({
      id: [''],
      cuit: [''],
      razonSocial: [''],
      actividadAfip: this.formBuilder.group({
        id: [null],
        descripcion: ['No hay información disponible...']
      }),
      condicionIva: this.formBuilder.group({
        id: [],
        descripcion: ['']
      }),
      estado: [''],
      numeroIngresosBrutos: [''],
      calle: [''],
      numeroCalle: [''],
      piso: [''],
      departamento: [''],
      cpLocalidad: [''],
      cpArgentino: [''],
      telFijo: [''],
      telCelular: [''],
      email: ['']
    });

    this.empresaId = this.activatedRoute.snapshot.params.empresaId || null;
  }

  @ViewChildren(LoadingDirective) loadings: QueryList<LoadingDirective>;

  controlsLoading: any = {
    vista: {
      isLoading: true,
      descripcion: 'vista',
      type: 'table'
    }
  };

  empresaId;

  formGroup: FormGroup;

  fillForm() {
    this.empresaService.getEmpresaById(this.empresaId).subscribe(r => {
      if (r) this.formGroup.patchValue(r[0]);
    }).add(() => {
      this.utilService.setControlsLoadingState('vista', false, this.loadings);
    });
  }

  ngOnInit() {
    this.fillForm();
    this.getResponsablesDeNegocio();
  }

  getResponsablesDeNegocio() {

    this.isPostingRN = true;

    this.empresaService.getResponsablesNegocioByEmpresa(this.empresaId).subscribe(
      r => {
        this.listaResponsablesDeNegocio.data = r ? r : [];
        this.isPostingRN = false;
      },
      error => {
        this.isPostingRN = false;
      });
  }
}
