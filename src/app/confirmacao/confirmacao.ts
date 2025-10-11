import { Component, OnInit, signal } from '@angular/core';
import { Checkbox } from "../utils/checkbox/checkbox";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Convidado } from '../../type/convite.DTO';
import { map, Observable } from 'rxjs';
import { ConviteService } from '../../service/convite.service';

@Component({
  selector: 'app-confirmacao',
  imports: [FormsModule, Checkbox, CommonModule],
  templateUrl: './confirmacao.html',
  styleUrl: './confirmacao.scss'
})
export class Confirmacao implements OnInit {

  protected convidados = signal<Convidado[]>([]);


  constructor(
    private readonly conviteService: ConviteService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.conviteService.conviteSelecionado.pipe(
      map(convite => convite?.convidados ?? [])
    ).subscribe(convidados => {
      this.convidados.set(convidados);
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.conviteService.carregarConvite(id);
  }

  public confirmarPresenca() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    const convidadoIds = this.convidados().filter(convidado => convidado.selecionado)
      .map(convidado => convidado.id);

    this.conviteService.confirmarPresenca(id, convidadoIds);

  }
}
