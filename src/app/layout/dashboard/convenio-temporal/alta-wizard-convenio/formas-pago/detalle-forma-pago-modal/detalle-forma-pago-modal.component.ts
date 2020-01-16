import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormasDePagoService } from '@app/services/empresa/convenios/alta-wizard/componentes/formas-de-pago.service';

@Component({
  selector: 'app-detalle-forma-pago-modal',
  templateUrl: './detalle-forma-pago-modal.component.html',
  styleUrls: ['./detalle-forma-pago-modal.component.scss']
})
export class DetalleFormaPagoModalComponent implements OnInit {

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

  }

  bancosList = [];

  close() {
    this.dialogRef.close();
  }

}
