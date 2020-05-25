import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { FormasDePagoService } from '@app/services/empresa/convenios/alta-wizard/componentes/formas-de-pago.service';
import { FormControl } from '@angular/forms';

// (1) Agregado para fecha vencimiento tarjeta mes/año
import { Moment } from 'moment';
import * as moment from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
// Fin (1)

@Component({
  selector: 'app-detalle-forma-pago-modal',
  templateUrl: './detalle-forma-pago-modal.component.html',
  styleUrls: ['./detalle-forma-pago-modal.component.scss'],
  // (2) Agregado para fecha vencimiento tarjeta mes/año
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
  // Fin (2)
})
export class DetalleFormaPagoModalComponent implements OnInit {

  date = new FormControl(moment());

  constructor(private dialogRef: MatDialogRef<DetalleFormaPagoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: FormasDePagoService) {
    this.service.getTiposFormasDePago('TC')
      .subscribe(res => {
        if (this.data.tipo == 'TC') {
          this.data.datos.bancoDesc = res.find(tarjeta => tarjeta.codigo == this.data.datos.bancoId).descripcion
        }
      });

    this.bancosList = JSON.parse(window.localStorage.getItem('bancos'));

    if (this.data.tipo == 'CBU') {
      this.data.datos.bancoDesc = this.bancosList.find(banco => banco.id == this.data.datos.bancoId).descripcion.trim();
      this.data.datos.tipoCuenta = (this.data.datos.tipoCuenta == 'CC') ? 'Cuenta corriente' : 'Caja de ahorro';
    }
  }

  ngOnInit() {
    if (this.data.tipo == 'TC') {
      if (this.data.datos.fechaVencimiento) {
        this.date.setValue(moment(this.data.datos.fechaVencimiento));
      }
    }
  }

  bancosList = [];

  close() {
    this.dialogRef.close();
  }

}
