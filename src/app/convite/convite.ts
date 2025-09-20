import { Component, OnInit } from '@angular/core';
import { ConviteService } from '../../service/convite.service';
import { Observable } from 'rxjs';
import { ConviteDTO } from '../../type/convite.DTO';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-convite',
  imports: [CommonModule],
  templateUrl: './convite.html',
  styleUrl: './convite.scss'
})
export class Convite implements OnInit {
  protected convite$!: Observable<ConviteDTO | null>;

  constructor(private readonly conviteService: ConviteService) {
    
  }

  ngOnInit(): void {
    this.convite$ = this.conviteService.conviteSelecionado;
    this.conviteService.carregarConvite(51);
    
  }
}



