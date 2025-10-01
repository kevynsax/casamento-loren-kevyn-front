import { Component } from '@angular/core';
import { Checkbox } from "../utils/checkbox/checkbox";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirmacao',
  imports: [FormsModule, Checkbox],
  templateUrl: './confirmacao.html',
  styleUrl: './confirmacao.scss'
})
export class Confirmacao {
  aceitou: boolean = false;

}
