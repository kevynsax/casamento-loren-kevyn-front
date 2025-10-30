import { Component, OnInit } from '@angular/core';
import { ConviteService } from '../../../service/convite.service';
import { Observable } from 'rxjs';
import { ConviteDTO } from '../../../type/convite.DTO';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-convite',
    imports: [CommonModule],
    templateUrl: './convite.html',
    styleUrl: './convite.scss'
})
export class Convite implements OnInit {
    protected convite$!: Observable<ConviteDTO | null>;

    constructor(
        private readonly conviteService: ConviteService,
        private readonly route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.convite$ = this.conviteService.conviteSelecionado;
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.conviteService.carregarConvite(id);
    }
}



