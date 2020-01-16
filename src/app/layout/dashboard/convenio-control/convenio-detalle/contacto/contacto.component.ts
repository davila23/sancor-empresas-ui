import { Component, OnInit, Input, ViewChildren, QueryList, Output, EventEmitter, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UtilService } from '@app/core';
import { ContactoService } from '@app/services/empresa/convenios/alta-wizard/componentes/contacto.service';
import { LoadingDirective } from '@app/shared/loading.directive';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'contacto-control',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {
  
  constructor(
    private _fb: FormBuilder,
    private _service: ContactoService,
    private _utilService: UtilService) {
    this.contactoForm = this._fb.group({
      empresaId: [null ,[Validators.required]],
      codigoDomicilio: [null],
      calle: [null,[Validators.required]],
      numero: [null,[Validators.required, Validators.max(99999), Validators.maxLength(5)]],
      piso: [null],
      barrio: [null],
      departamento: [null],
      codigoPostal: [null,[Validators.required]],
      cpArgentino: [null],
      recibeCorrespondencia: ['S'],
      localidadId: [null,[Validators.required]],
      edición: [false],
      orientacion: [null],
      otrosDatos1: [null],
      otrosDatos2: [null],
      otrosDatos3: [null],
      otrosDatos4: [null],
      esPrincipal: true
    });
  }

  @ViewChildren(LoadingDirective) loadings: QueryList<LoadingDirective>;

  controlsLoading: any = {
    contacto: {
      isLoading: true,
      descripcion: 'contacto',
      type: 'table'
    }
  };

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.telefonosEmailsDataSource.paginator = this.paginator;
  }  private paginator: MatPaginator;

  @Output() setForms: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  @Input() set convenioId(convenioId) {
    setTimeout(() => {
      this.convenioIdFlag = convenioId;

      this.fillForm();
    });
  } private convenioIdFlag;

  noDataAvailable = true;

  codPostalControl = new FormControl();
  codPostalList: any = [];

  contactoForm: FormGroup;

  telefonosEmails: any = [];

  telefonosEmails_displayedColumns = [
    'tipo',
    'valor',
    'observaciones'
  ];

  telefonosEmailsDataSource = new MatTableDataSource(this.telefonosEmails);

  fillForm() {
    this._service.getDomiciliosTemporales(this.convenioIdFlag).subscribe(r => {

      if (!r.length) return false;
      else this.noDataAvailable = false;

      const sortedResponse = r.sort((leftSide, rightSide): number => {

        if (leftSide.esPrincipal > rightSide.esPrincipal) return -1;
        if (leftSide.esPrincipal < rightSide.esPrincipal) return 1;

      });
      
      let x = (sortedResponse.length) ? sortedResponse[0] : [];

      this.telefonosEmails = (x.listaTelefonos) ? x.listaTelefonos : [];

      this.telefonosEmails.find(r => {
        if (r.tipo == 'C') {
          r.tipo = 'Celular';
          r.numero = String(r.caracteristica + r.numero).trim();
        } else if (r.tipo == 'T') {
          r.tipo = 'Teléfono';
          r.numero = String(r.caracteristica + r.numero).trim();
        } else {
          r.tipo = 'Email';
        }

        return false;
      });

      this.telefonosEmailsDataSource.data = this.telefonosEmails;

      this.contactoForm.patchValue({
        barrio: x.barrio,
        calle: x.calle,
        codigoDomicilio: x.codigoDomicilio,
        cpArgentino: x.cpArgentino,
        departamento: x.departamento,
        numero: x.numero,
        orientacion: x.orientacion,
        otrosDatos1: x.otrosDatos1,
        otrosDatos2: x.otrosDatos2,
        otrosDatos3: x.otrosDatos3,
        otrosDatos4: x.otrosDatos4,
        piso: x.piso,
        codigoPostal: x.localidad.codigoPostal,
        localidadId: x.localidad.codigoPostal,
      });

      this.codPostalControl.setValue(x.localidad.codigoPostal);
    }).add(() => {
      if (!this.noDataAvailable) {
        setTimeout(() => {
          this._utilService.setControlsLoadingState('contacto', false, this.loadings);
        });
      }
    });
  }

  ngOnInit() {
    
  }

}
