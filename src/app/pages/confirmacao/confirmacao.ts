import { Component, OnInit, signal } from '@angular/core';
import { Checkbox } from '../../utils/checkbox/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConviteDTO } from '../../../type/convite.DTO';
import { map, Observable } from 'rxjs';
import { ConviteService } from '../../../service/convite.service';
import { Footer } from '../../footer/footer';
import { ConvidadoDTO } from '../../../type/Convidado.DTO';

@Component({
    selector: 'app-confirmacao',
    imports: [FormsModule, Checkbox, CommonModule, Footer],
    templateUrl: './confirmacao.html',
    styleUrl: './confirmacao.scss'
})
export class Confirmacao implements OnInit {

    protected convidados = signal<ConvidadoDTO[]>([]);
    protected convite!: Observable<ConviteDTO | null>;
    protected success = signal(false);

    constructor(
        private readonly conviteService: ConviteService,
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) {
    }

    ngOnInit(): void {
        const convite$ = this.conviteService.conviteSelecionado;
        this.convite = convite$;

        convite$.pipe(
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

        this.conviteService.confirmarPresenca(id, convidadoIds).subscribe({
            next: () => {
                this.success.set(true);
                setTimeout(() => {
                    this.router.navigate(['/']);
                }, 5000);
            },
            error: (err: any) => {
                console.error('Erro ao confirmar presença:', err);
            }
        });
    }
}
