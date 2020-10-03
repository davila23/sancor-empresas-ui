import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion, MatTableDataSource, MatDialog } from '@angular/material';
import { GrillaDTO } from '@app/models/empresa/convenios/grilla.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormasDePagoService } from '@app/services/empresa/convenios/alta-wizard/componentes/formas-de-pago.service';
import { UtilService } from '@app/core';

@Component({
  selector: 'app-detalles-edicion',
  templateUrl: './detalles-edicion.component.html',
  styleUrls: ['./detalles-edicion.component.scss']
})
export class DetallesEdicionComponent implements OnInit {

  constructor(private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formasPagoService: FormasDePagoService,
    private _utilService: UtilService) {

    this.empresaId = this.activatedRoute.snapshot.params.empresaId || null;
    this.convenioId = this.activatedRoute.snapshot.params.convenioId || null;

    this.permisos = JSON.parse(localStorage.getItem('steps')).definitivo;

    if (localStorage.getItem('bancos') == null) {
      this.formasPagoService.getBancos().subscribe(
        res => {
          localStorage.setItem('bancos', JSON.stringify(res));
        }
      )
    }


    /* Temporarily validation */
    if (!this.empresaId || !this.convenioId) this.router.navigate(['/404']);
    if (!Number(this.empresaId) || !Number(this.convenioId)) this.router.navigate(['/404']);

  }

  permisos = [];

  @ViewChild('matAccordion') matAccordion: MatAccordion;

  convenioId;
  empresaId;

  stepsEditionOrDetail = [
    { name: 'datosGenerales', isEdition: false },
    { name: 'contacto', isEdition: false },
    { name: 'referente', isEdition: false },
    { name: 'grillas', isEdition: false },
    { name: 'planesConvenidos', isEdition: false },
    { name: 'subsidios', isEdition: false },
    { name: 'formaPago', isEdition: false },
    { name: 'entidades', isEdition: false },
    { name: 'datosImpositivos', isEdition: false },
    { name: 'correspondencia', isEdition: false },
    { name: 'sucursales', isEdition: false },
    { name: 'vip', isEdition: false },
    { name: 'archivos', isEdition: false }
  ]

  multi = false;


  focusPanel(panel) {
    const position = (panel.offsetTop) ? panel.offsetTop : panel._body.nativeElement.offsetTop;
    window.scrollTo({
      top: (position - 60),
      behavior: 'smooth',
    });
  }

  toggleAccordion() {
    this.multi = !this.multi;

    if (this.multi === false) {
      this.matAccordion.closeAll();
    }
  }

  editOrDetail($event: Event, step: string) {
    $event.stopPropagation();

    this.stepsEditionOrDetail.forEach((res) => {
      if (res.name == step) {
        if (!res.isEdition) {
          if (this.renderSteps('edicion', step)) {
            res.isEdition = !res.isEdition;
          } else {
            this._utilService.notification('No tenés permisos para modificar estos datos.', 'warning');
          }
        } else {
          res.isEdition = !res.isEdition;
        }
      }
    });
  }

  ngOnInit() { }

  renderSteps(action: string, step: string) {
    if (this.permisos.length > 0) {
      let element = this.permisos.filter(x => x.stepName === step.toUpperCase());
      if (element.length > 0) {
        switch (action) {
          case 'lectura':
            return element[0].lectura;
          case 'delete':
            return element[0].delete;
          case 'edicion':
            return element[0].edicion;
        }
      } else {
        return true;
      }
    } else {
      this._utilService.notification('No se pudo validar tus permisos.', 'warning');
      return false;
    }

    // for (let i = 0; i < this.permisos.length; i++) {

    // if (this.permisos[i].stepName == step.toUpperCase()) {
    //   switch (action) {
    //     case 'lectura':
    //       return this.permisos[i].lectura;
    //     case 'delete':
    //       console.log(this.permisos[i].delete, step);
    //       return this.permisos[i].delete;
    //     case 'edicion':
    //       return this.permisos[i].edicion;
    //   }
    // }
    // }

  }

}
