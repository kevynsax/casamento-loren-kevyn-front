import { BehaviorSubject, catchError, throwError } from "rxjs";
import { ConviteDTO } from "../type/convite.DTO";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ConviteService {
    private _conviteSelecionado = new BehaviorSubject<ConviteDTO | null>(null);
    public conviteSelecionado = this._conviteSelecionado.asObservable();

    private apiUrl = "http://localhost:8080/convite";

    constructor(private http: HttpClient) { }

    public carregarConvite = (id: number) => {
        this.http.get<ConviteDTO>(`${this.apiUrl}/${id}`)
            .subscribe({
                next: (convite) => this._conviteSelecionado.next(convite),
                error: (err) => console.error('Erro ao carregar convite: ', err)            
            });
    }

    public confirmarPresenca = (idConvite: number, idConvidadoPresenca: number[]) => {
        this.http.put<ConviteDTO>(`${this.apiUrl}`, {idConvite, idConvidadoPresenca})
            .subscribe({
                next: (convite) => this._conviteSelecionado.next(convite),
                error: (err) => console.error('Erro ao confirmar presença: ', err)            
            });        
    }
}

