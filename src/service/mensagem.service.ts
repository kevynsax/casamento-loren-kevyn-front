import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { MensagemDTO, NovaMensagemDTO } from '../type/Mensagem.DTO';

@Injectable({
  providedIn: 'root'
})
export class MensagemService {
  private apiUrl = `${environment.apiBaseUrl}/mensagem`;

  constructor(private http: HttpClient) {}

  listarMensagens(): Observable<MensagemDTO[]> {
    return this.http.get<MensagemDTO[]>(this.apiUrl);
  }

  criarMensagem(mensagem: NovaMensagemDTO): Observable<MensagemDTO> {
    return this.http.post<MensagemDTO>(this.apiUrl, mensagem);
  }
}

