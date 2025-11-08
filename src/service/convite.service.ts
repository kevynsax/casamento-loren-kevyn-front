import { BehaviorSubject, Observable } from "rxjs";
import { ConviteDTO } from "../type/convite.DTO";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class ConviteService {
    private _conviteSelecionado = new BehaviorSubject<ConviteDTO | null>(null);
    public conviteSelecionado = this._conviteSelecionado.asObservable();

    private apiUrl = `${environment.apiBaseUrl}/convite`;

    constructor(private http: HttpClient) { }

    public listarConvites(): Observable<ConviteDTO[]> {
        return this.http.get<ConviteDTO[]>(this.apiUrl);
    }

    public carregarConvite = (id: number) => {
        this.http.get<ConviteDTO>(`${this.apiUrl}/${id}`)
            .subscribe({
                next: (convite) => this._conviteSelecionado.next(convite),
                error: (err) => console.error('Erro ao carregar convite: ', err)
            });
    }

    public confirmarPresenca = (idConvite: number, idConvidadoPresenca: number[]) => {
        return this.http.put<ConviteDTO>(`${this.apiUrl}`, {idConvite, idConvidadoPresenca})
            .pipe(
                tap(convite => this._conviteSelecionado.next(convite))
            );
    }
}
