import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  constructor() { }

  private anyKindOfValue: any;
    
  set value(value: any) {
    this.anyKindOfValue = value;
  }

  get value() {
    return this.anyKindOfValue;
  }
}
