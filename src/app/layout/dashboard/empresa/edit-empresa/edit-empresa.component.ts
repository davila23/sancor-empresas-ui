import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { EmpresaService } from '@app/services/empresa/empresa.service';
import { Observable } from 'rxjs';
import { EmpresaDTO } from '@app/models/empresa/empresa.model';
import { tap, map, startWith } from 'rxjs/operators';
import { CondicionIvaService } from '@app/services/condicion-iva/condicion-iva.service';
import { CondicionIvaDTO } from '@app/models/empresa/condicion-iva-model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActividadAfipDTO } from '@app/models/empresa/actividad-afip.model';
import { CustomValidators } from '@tres-erres/ngx-utils';
import { ContactoService } from '@app/services/empresa/convenios/alta-wizard/componentes/contacto.service';
import { UtilService } from '@app/core';

@Component({
  selector: 'app-edit-empresa',
  templateUrl: './edit-empresa.component.html',
  styleUrls: ['./edit-empresa.component.scss']
})
export class EditEmpresaComponent implements OnInit {

  constructor(private empresaService: EmpresaService,
              private condicionIvaService: CondicionIvaService,
              private contactoService: ContactoService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private utilService: UtilService,
              private router: Router) 
  {
    this.empresaId = this.route.snapshot.params["empresaId"];

    this.empresaService.getEmpresaById(this.empresaId).subscribe(console.log);

    this.condicionIvaService.getCondicionesIva()
    .subscribe(res => this.condicionesIva = res);

    this.actividades = JSON.parse(localStorage.getItem('actividades'));

		if (this.actividades == null) {
			this.empresaService.obtenerActividadesEmpresa()
			.subscribe(res => {
				localStorage.setItem('actividades', JSON.stringify(res));
			});
    }
  }

  CUIT_REGEX = /\b(20|23|24|27|30|33|34)(\-)?[0-9]{8}(\-)?[0-9]/g;
  CUIT_REGEX_STRICT = /\b(20|23|24|27|30|33|34)(\-)[0-9]{8}(\-)[0-9]/g;

  isCuitValid = true;

	actividadAfip : FormControl = new FormControl();
  codPostalControl: FormControl = new FormControl();
	actividadCtrl: FormControl = new FormControl();
  condicionesIva : CondicionIvaDTO[];
	actividades : ActividadAfipDTO[] = [];
	filteredOptionsActividad: any;
  filteredActividades: Observable<any[]>;
  codPostalList: any = [];

  formGroup: FormGroup;
  empresa: Observable<EmpresaDTO>;
  empresaId: number;
  idCondivionIva: number;
  empresaUpdate :EmpresaDTO;

  posting = false;
  loading = true;

  ngOnInit() {
		this.filteredActividades = this.actividadCtrl.valueChanges
		.pipe(
			startWith(''),
			map(actividad => actividad ? this.filterStates(actividad) : this.actividades.slice())
		);

    this.createForm();

    this.empresaService.getEmpresaById(this.empresaId)
    .subscribe(r => {
      let empresa = r[0];

      let cuit: string = String(empresa.cuit);

      if (!this.CUIT_REGEX_STRICT.test(cuit) && this.CUIT_REGEX.test(cuit)) {
        cuit = this.InsertAt(cuit, '-', 2);
        cuit = this.InsertAt(cuit,'-', cuit.length - 1);

        this.isCuitValid = this.CUIT_REGEX_STRICT.test(cuit);
      } else {
        this.isCuitValid = false;
      }

      empresa.cuit = cuit;

      if (empresa.actividadAfip) this.actividadCtrl.patchValue(empresa.actividadAfip.descripcion);
      if (empresa.cpArgentino) this.codPostalControl.patchValue(empresa.cpArgentino);

      this.formGroup.patchValue(empresa);
    }).add(() => {
      this.loading = false;
    });
  }

  compararIva(val1,val2){
    return val1 == val2.id;
  }

  createForm() {
	  this.formGroup = this.formBuilder.group({
		  id:[this.empresaId],
		  cuit: [null, [CustomValidators.cuit, Validators.required]],
		  razonSocial: [null, [Validators.required,Validators.maxLength(100)]],
		  condicionIva: this.formBuilder.group({
        id: [null, Validators.required],
        descripcion: ['']
      }),
		  numeroIngresosBrutos: [null],
		  actividadAfip: [null],
		  estado: [null],
		  calle: [null, [Validators.required,Validators.maxLength(30)]],
		  numeroCalle: [null, Validators.required],
		  piso: [null],
		  departamento: [null, [Validators.maxLength(5)]],
		  cpLocalidad: [null, [Validators.required,Validators.maxLength(8)]],
		  cpArgentino: [null, [Validators.required,Validators.maxLength(8)]],
		  telFijo: [null, [Validators.maxLength(15)]],
		  telCelular: [null, [Validators.maxLength(15)]],
		  email: [null, [Validators.email ,Validators.maxLength(50)]]
    });
    
    this.formGroup.valueChanges.subscribe(r => {
      console.log(r);
    })
  }

  onSubmit(){
    if (this.formGroup.valid) {
      this.posting = true;
	    this.empresaUpdate = this.formGroup.value as EmpresaDTO;
      this.empresaUpdate.id = this.empresaId;
      this.empresaUpdate.usuario = "supervisor";
      this.empresaUpdate.estado = '1';
      this.empresaUpdate.cuit = Number(this.empresaUpdate.cuit.toString().replace(/-/g, ''));
      this.empresaService.addEmpresa(this.empresaUpdate)
      .subscribe(r => { 
        if (!r.length) {
          this.utilService.notification('Actualización completa!','success');
          this.router.navigate(['/empresa/busqueda']);

        } else {
          this.utilService.notification(r[0].detalle, (r[0].codigo == 0) ? 'success' : 'warning');
        }
      }).add(() => {
				this.posting = false;
			});
    }
  }

  InsertAt(string, CharToInsert,Position) {
    return string.slice(0,Position) + CharToInsert + string.slice(Position)
  }

  filterStates(name: string) {
    return this.actividades.filter(actividad =>
		  actividad.descripcion.toLowerCase().indexOf(name.toString().toLowerCase()) === 0);
	}
	
	onEnter(evt: any){
    if (evt.source.selected) {
			this.actividadCtrl.setValue(evt.source.value.descripcion);
			this.formGroup.controls['actividadAfip'].setValue(evt.source.value);
    }
  }

  codigoPostalListFill(val) {
    setTimeout(() => {
      this.contactoService.getLocalidades(val).subscribe(r => {
        this.codPostalList = r.listaResultado;
     });
    }, 400);
  }

  codigoPostalPatchValue(cod ,$event?) {
		let val = cod.codigoPostal;
		
    this.formGroup.patchValue({
			cpLocalidad: val,
			cpArgentino: String(val)
    });
  }
}
