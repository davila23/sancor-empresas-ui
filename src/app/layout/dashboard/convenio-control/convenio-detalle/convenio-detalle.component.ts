import { Component, OnInit, ViewChild } from '@angular/core';
import {  MatAccordion } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ControlConvenioService } from '@app/services/control/control-convenio.service';
import { ConvenioMovimientoDTO } from '@app/models/convenio-movimiento.model';
import { UtilService } from '@app/core';

@Component({
  selector: 'app-convenio-detalle',
  templateUrl: './convenio-detalle.component.html',
  styleUrls: ['./convenio-detalle.component.scss']
})
export class ConvenioDetalleComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private controlConvenioService: ControlConvenioService,
    private utilService: UtilService ) {

      this.convenioId = this.activatedRoute.snapshot.params.convenioId || null;

      /* TODO validation */ 
      if (!this.convenioId) this.router.navigate(['/404']);
      if (!Number(this.convenioId)) this.router.navigate(['/404']);

      this.form = this.fb.group({
        observaciones: ['', [Validators.required, Validators.maxLength(500)]]
      });
  }

  @ViewChild('matAccordion') matAccordion: MatAccordion;

  form: FormGroup;
  convenioId;
  empresaId;

  dialogRef = null;

  multi = false;

  focusPanel(panel) {
    const position = (panel.offsetTop) ? panel.offsetTop : panel._body.nativeElement.offsetTop;
    window.scrollTo({
    top: (position - 60),
    behavior: 'smooth',
    });
  }

  ngOnInit() {

  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cambiarEstado(estado, tipo){
      console.log(estado);
      console.log(tipo);

    if (!this.form.valid && estado != 4){
      this.markFormGroupTouched(this.form);
      return false;
    }

    if (this.dialogRef === null) {
			this.dialogRef = this.utilService.openConfirmDialog({
				titulo: 'Diálogo de confirmación',
				texto:  (tipo == 'correccion') ? '¿Desea enviar a corrección?' : '¿Desea aprobar este convenio?',
				confirmar: (tipo == 'correccion') ? 'Enviar a corrección' : 'Aprobar',
				cancelar: 'Cancelar'
      });
      
      this.utilService.loseFocus();
      
      this.dialogRef.afterClosed().toPromise().then((respuesta) => {
          console.log(respuesta);
        if (respuesta) {
          let convenioMovimientoDTO = new ConvenioMovimientoDTO();
          convenioMovimientoDTO.idConvenioEstado = Number(estado);
          convenioMovimientoDTO.idConvenio = Number(this.convenioId);
          convenioMovimientoDTO.usuario = 'SUPERVISOR'; 
          convenioMovimientoDTO.observacion = this.form.get('observaciones').value;

          if(estado == 4){
            this.controlConvenioService.guardarConvenioDefinitivo(this.convenioId).subscribe(
              r=>{
                console.log(r);
                /*if(r){                 
                  this.utilService.notification("Hubo errores al guardar convenio definitivo", 'warning', 4000);
                } else {*/
                  this.utilService.notification("Guardado exitoso convenio definitivo", 'success', 4000);
                //}
                this.router.navigate(['/convenioscontrol']);
              }
 
           )
          }

          this.controlConvenioService.addConvenioMovimiento(convenioMovimientoDTO).subscribe(r => {
            
            let msj = (estado == 3) 
              ? 'Convenio enviado a corrección' 
              : 'Convenio aprobado';

            
            this.utilService.notification(msj, 'success', 4000);
            this.router.navigate(['/convenioscontrol']);
          });
        }

        this.dialogRef = null;
			});
		}
    
  }
}
