import { Component, Input, Self } from '@angular/core';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-text-input',
  imports: [
    MatFormField,
    MatInput,
    MatError,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss'
})
// ControlValueAccessor = MOST između Angular formi i moje custom komponente
export class TextInputComponent {
    @Input() label = '';
    @Input() type = 'text';

    constructor(@Self() public controlDir: NgControl) { // jedan input = jedan FormControl(@Self)
      this.controlDir.valueAccessor = this; //“Ova komponenta (TextInputComponent) je TA koja zna kako se čita i piše vrednost.”
    }

    writeValue(obj: any): void {
    }

    registerOnChange(fn: any): void {
    }

    registerOnTouched(fn: any): void {
    }

    get control() {
      return this.controlDir.control as FormControl; //omogucava da imam control.errors, control.touched, control.invalid
    }
}