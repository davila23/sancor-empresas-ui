import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ArchivosService } from '@app/services/empresa/convenios/alta-wizard/componentes/archivos.service';
import { HttpEventType } from '@angular/common/http';
import 'rxjs/add/operator/finally';
import { UtilService } from '@app/core';
import {types} from '@app/models/types'; 

@Component({
  selector: 'app-detalle-archivos',
  templateUrl: './detalle-archivos.component.html',
  styleUrls: ['./detalle-archivos.component.scss']
})
export class DetalleArchivosComponent {

  constructor(private _service: ArchivosService, private _utilService: UtilService) { 
    this.fillDownloads();
  }

  @Input() set convenioId (convenioId) { this.convenioIdFlag = convenioId };
  convenioIdFlag = null;

  @Input() set isEdition (isEdition) { this.isEditionFlag = isEdition; } 
  isEditionFlag = false;

  @ViewChild('inputFile') inputFile: ElementRef;

  typesList = [];
  typesState = [];
  currentInteraction = null;

  uploadFile(element: HTMLInputElement, $event) {
    $event.stopPropagation();
    let id = $event.currentTarget.id;
    element.setAttribute('id', id);
    element.click();
  }

  renderFile($event):any {
    $event.stopPropagation();

    if (!$event.target.files.length) return false;

    const type = $event.target.id;

    let index = null;
    for (let i = 0; i < this.typesState.length; i ++) {
      if (Number(this.typesState[i].id) == Number(type)) {
        index = i;
      }
    }

    let file:File = $event.target.files[0];
    const name = file.name.substr(0, file.name.lastIndexOf('.'));
    const extension = file.name.substr(file.name.lastIndexOf('.')+1, file.name.length);

    let obj = { 
      convenio:{
        id: Number(this.convenioIdFlag)
      },
      tipoAdjunto:{
        id: Number(type)
      },
      nombreArchivo: name,
      informacionArchivo:{
        nombreImagen: name,
        extension: extension,
        imagen: null
      }
    }

    let myReader:FileReader = new FileReader();

    let subscription = null;

    myReader.readAsDataURL(file);
    myReader.onloadend = () => {
      obj.informacionArchivo.imagen = myReader.result as string;
      obj.informacionArchivo.imagen = obj.informacionArchivo.imagen.split(',')[1];
      subscription = this._service.postFile(obj).finally(() =>{
        this.typesState[index].progress = 0;
        this.typesState[index].upload.isUploading = false;
        this.typesState[index].upload.waitingForServer = false;
        this.fillUploadedFiles();
        subscription.unsubscribe();
      }).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          if (!this.typesState[index].upload.isUploading && !this.typesState[index].upload.waitingForServer) {
            this.typesState[index].upload.isUploading = true;
          }
  
          if (this.typesState[index].progress != 100) {
            this.typesState[index].progress = Math.round(event.loaded / event.total * 100);
          } else {
            this.typesState[index].upload.isUploading = false;
            this.typesState[index].upload.waitingForServer = true;
          }
        } else if (event.type === HttpEventType.Response) {
          this.typesState[index].progress = 0;
          this.typesState[index].upload.isUploading = false;
          this.typesState[index].upload.waitingForServer = false;
          this._utilService.notification('¡Archivo subido con éxito!', 'success', 2000);
        }
      });
    }

    // Reseting input to prevent <same file upload bug>
    this.inputFile.nativeElement.value = null;
  }

  fillDownloads() {
    let downloads:any = [];

    this._service.getTypes().subscribe(r => {
      downloads = r;
      for (let i = 0; i<downloads.length; i++) {
        Object.assign(downloads[i],
          {
            progress: 0,
            upload: { isUploading: false, waitingForServer: false },
            download: { isDownloading: false, waitingForServer: false, file: [] }
          }
        );
      }

      this.typesState = downloads;

      this.fillUploadedFiles();
    });
  }

  download(id) {
    let idImagen = null;
    let index;

    for (let i in this.typesState) {
      if (this.typesState[i].id == id) {
        index = i;
        idImagen = this.typesState[i].download.file[0].idImagen;
      }
    }

    this._service.downloadFile(idImagen).subscribe(event => {
      if (event.type === HttpEventType.DownloadProgress) {
        if (!this.typesState[index].download.isDownloading && !this.typesState[index].download.isDownloading) {
          this.typesState[index].download.isDownloading = true;
        }

        this.typesState[index].progress = Math.round(event.loaded / 1000);
        
      } else if (event.type === HttpEventType.Response) {
        this.typesState[index].download.isDownloading = false;
        this.typesState[index].download.waitingForServer = true;
        this.typesState[index].progress = 0;

        const file = event.body.listaResultado[0];

        const filename = file.imagennombre.substr(0, file.imagennombre.lastIndexOf('.'));
        const extension = file.imagennombre.substr(file.imagennombre.lastIndexOf('.')+1, file.imagennombre.length);

        let contentType = 'text/txt';
        for (let i = 0; i<types.length; i++) {
          if (types[i].extension == extension) {
            contentType = types[i].contentType;
          }
        }

        const byteCharacters = atob(file.imagen);

        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {type: contentType});

        const blobUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = blobUrl;
        a.download = filename;
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
          document.body.removeChild(a);
        }, 0);

        this.typesState[index].download.waitingForServer = false;
        
        this._utilService.notification('¡Archivo descargado con éxito!', 'success', 2000);
      }
    });
  }

  b64toBlob(b64Data, contentType='', sliceSize=512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
      
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }


  fillUploadedFiles() {
    this._service.getList(this.convenioIdFlag).subscribe(r =>{
      for (let i in r) {
        for (let j in this.typesState) {
          if (r[i].tipoAdjunto.id == this.typesState[j].id) {
            this.typesState[j].download.file[0] = r[i];
          }
        }
      }
    });
  }

}
