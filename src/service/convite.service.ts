import { BehaviorSubject, catchError, throwError } from "rxjs";
import { ConviteDTO } from "../type/convite.DTO";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

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
            .pipe(
                catchError(this.handleError)
            )
            .subscribe({
                next: (convite) => this._conviteSelecionado.next(convite),
                error: (err) => console.error('Erro ao carregar convite:', err)            
            });
    }

    private handleError(error: any) {
        console.error('Erro na requisição:', error);

        if (error.error instanceof ErrorEvent) {
            console.error('Erro convite selecionado: ', error.error.message);
        } else {
            console.error(`Código do erro: ${error.status}, Mensagem: ${error.error}`);
        }

        return throwError(() => new Error('Algo deu errado; tente novamente mais tarde.'));
    }

}

