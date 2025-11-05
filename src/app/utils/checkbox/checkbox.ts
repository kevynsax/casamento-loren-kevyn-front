import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  imports: [],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Checkbox),
      multi: true
    }
  ]
})
export class Checkbox implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() id: string = '';

  @Output() checkChange = new EventEmitter<boolean>();

  private _checked: boolean = false;

  get checked(): boolean {
    return this._checked;
  }

  set checked(value: boolean) {
    this._checked = value;
    this.onChange(value);
    this.checkChange.emit(value);
  }

  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  writeValue(value: boolean): void {
    this._checked = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onCheckboxChange(event: Event): void {
    this.checked = !this.checked;
    this.onTouched();
  }
}
