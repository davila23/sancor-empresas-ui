import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { VipService } from '@app/services/empresa/convenios/alta-wizard/componentes/vip.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { UtilService } from '@app/core';
import { VipDTO } from '@app/models/vip.model';

@Component({
  selector: 'detalle-vip',
  templateUrl: './detalle-vip.component.html',
  styleUrls: ['./detalle-vip.component.scss']
})
export class DetalleVipComponent implements OnInit {

  constructor(private service: VipService,
    private fb: FormBuilder,
    private utilService: UtilService) {
    this.vipForm = this.fb.group({
      dni: [null, [Validators.required]],
      convenioId: [null]
    });
  }

  @Input() set convenioId(convenioId) {
    setTimeout(() => {
      this.convenioIdFlag = convenioId;
      this.vipForm.patchValue({
        convenioId: convenioId
      });
      this.fillUsuarios();
    });
  } private convenioIdFlag;


  @Input() set isEdition(isEdition) {
    setTimeout(() => {
      this.isEditionFlag = isEdition;
    });
  } isEditionFlag = false;


  @Input() set isAllowedToEdit(boolean) {
    setTimeout(() => {
      this.edit = boolean;
    });
  } edit = false;

  @Input() set isAllowedToDelete(boolean) {
    setTimeout(() => {
      this.delete = boolean;
    });
  } delete = false;

  @Output() changeEditionFlag = new EventEmitter<boolean>();

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.vipDataSource.paginator = this.paginator;
  }

  private paginator: MatPaginator;

  vipForm: FormGroup;

  vipDataSource = new MatTableDataSource<any>([]);
  vip_displayedColumns = [
    'dni',
    'delete'
  ];

  edicionVipExistente: boolean = false;
  currentVip: VipDTO = null;

  isPosting = false;

  dialogRef = null;

  usuarioDelete(row) {

    if (this.dialogRef === null) {
      this.dialogRef = this.utilService.openConfirmDialog({
        titulo: '',
        texto: '¿Desea eliminar este usuario vip?',
        confirmar: 'Eliminar',
        cancelar: 'Cancelar'
      });

      this.utilService.loseFocus();

      this.dialogRef.afterClosed().toPromise().then((respuesta) => {
        if (respuesta) {
          this.isPosting = true;
          this.service.deleteUsuariosVip(row).subscribe(r => {
            if (!r.length) {
              this.fillUsuarios();
              this.utilService.notification('¡Registro eliminado con éxito!', 'success', 4000);
            } else {
              this.utilService.notification('Ocurrió un error', 'warning', 4000);
            }
          }).add(() => {
            this.isPosting = false;
          });
        }

        this.dialogRef = null;
      });
    }
  }

  fillUsuarios() {
    this.service.getUsuariosVip(this.convenioIdFlag).subscribe(r => {
      this.vipDataSource.data = (r) ? r : [];
    });
  }

  usuarioSaveAndRender() {

    if (this.vipForm.invalid) {
      (<any>Object).values(this.vipForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return
    }

    this.isPosting = true;

    this.service.postUsuariosVip(this.vipForm.value).subscribe(r => {
      if (!r.length) {
        this.fillUsuarios();
        this.vipForm.reset();
        this.vipForm.patchValue({ convenioId: this.convenioIdFlag })
        this.vipForm.controls['dni'].markAsPristine();
        this.vipForm.controls['dni'].markAsUntouched();

        this.utilService.notification('¡Usuario añadido con éxito!', 'success', 4000);
      } else {
        this.utilService.notification('Ocurrió un error', 'warning', 4000);
      }
    }).add(() => {
      this.isPosting = false;
    });
  }

  usuarioEditAndRender() {
    
    if (this.vipForm.invalid) {
      (<any>Object).values(this.vipForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return
    }

    this.isPosting = true;

    let vip = this.vipForm.value as VipDTO;
    vip.id = this.currentVip.id;
    vip.fechaBaja = null;

    this.service.postUsuariosVip(vip).subscribe(r => {
      if (!r.length) {
        this.fillUsuarios();
        this.vipForm.reset();
        this.vipForm.patchValue({ convenioId: this.convenioIdFlag })
        this.vipForm.controls['dni'].markAsPristine();
        this.vipForm.controls['dni'].markAsUntouched();

        this.utilService.notification('¡Usuario modificado con éxito!', 'success', 4000);
      } else {
        this.utilService.notification('Ocurrió un error', 'warning', 4000);
      }
    }).add(() => {
      this.isPosting = false;
      this.cancelEdit();
    });
  }

  usuarioEdit(row) {

    this.edicionVipExistente = true;
    this.isEditionFlag = true;
    this.changeEditionFlag.emit(true);
    this.currentVip = row;
    this.vipForm.patchValue(row);

  }

  cancelEdit() {

    this.isEditionFlag = false;
    this.changeEditionFlag.emit(false);
    this.edicionVipExistente = false;
    this.currentVip = null;
    this.vipForm.controls['dni'].reset();

  }

  ngOnInit() {

  }

}
