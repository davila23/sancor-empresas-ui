import { Component, Inject, Optional } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent {
  constructor(@Optional() @Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}
