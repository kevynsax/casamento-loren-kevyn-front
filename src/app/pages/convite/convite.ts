import { Component, OnInit } from '@angular/core';
import { ConviteService } from '../../../service/convite.service';
import { Observable } from 'rxjs';
import { ConviteDTO } from '../../../type/convite.DTO';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DATA_CASAMENTO, INICIO_CERIMONIA, FIM_CERIMONIA } from '../../../service/constants';

@Component({
    selector: 'app-convite',
    imports: [CommonModule],
    templateUrl: './convite.html',
    styleUrl: './convite.scss'
})
export class Convite implements OnInit {
    protected convite$!: Observable<ConviteDTO | null>;
    protected readonly dataCasamento = DATA_CASAMENTO;
    protected readonly inicioCerimonia = INICIO_CERIMONIA;
    protected readonly fimCerimonia = FIM_CERIMONIA;

    constructor(
        private readonly conviteService: ConviteService,
        private readonly route: ActivatedRoute
    ) {
    }

    protected formatarData(data: Date): string {
        return data.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
    }

    protected formatarDataCompleta(data: Date): string {
        return data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    protected formatarHora(data: Date): string {
        return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    ngOnInit(): void {
        this.convite$ = this.conviteService.conviteSelecionado;
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.conviteService.carregarConvite(id);
    }
}



