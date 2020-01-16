import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from './autocomplete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatInputModule } from '@angular/material';

@NgModule({
    declarations: [AutocompleteComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule
    ],
    exports: [AutocompleteComponent]
})
export class AutocompleteModule {}