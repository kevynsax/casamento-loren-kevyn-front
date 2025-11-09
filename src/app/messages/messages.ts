import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MensagemService } from '../../service/mensagem.service';
import { MensagemDTO, NovaMensagemDTO } from '../../type/Mensagem.DTO';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.scss'
})
export class Messages implements OnInit, OnDestroy {
  protected mensagens = signal<MensagemDTO[]>([]);
  protected loading = signal(true);
  protected nome = signal('');
  protected texto = signal('');
  protected submitting = signal(false);
  protected showSuccess = signal(false);
  protected errorMessage = signal<string | null>(null);
  private mensagensInterval?: any;

  constructor(private mensagemService: MensagemService) {}

  ngOnInit(): void {
    this.loadMensagens();
    this.startMensagensPolling();
  }

  ngOnDestroy(): void {
    this.stopMensagensPolling();
  }

  private loadMensagens(): void {
    this.mensagemService.listarMensagens().subscribe({
      next: (mensagens) => {
        // Sort by date, oldest first and add fixed rotation based on index
        const sorted = [...mensagens].sort((a, b) =>
          new Date(a.dataEnvio).getTime() - new Date(b.dataEnvio).getTime()
        ).map((msg, index) => ({
          ...msg,
          rotation: this.getFixedRotation(index)
        }));
        this.mensagens.set(sorted);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar mensagens:', err);
        this.loading.set(false);
      }
    });
  }

  private startMensagensPolling(): void {
    this.mensagensInterval = setInterval(() => {
      this.loadMensagens();
    }, 15000); // 15 seconds
  }

  private stopMensagensPolling(): void {
    if (this.mensagensInterval) {
      clearInterval(this.mensagensInterval);
      this.mensagensInterval = undefined;
    }
  }

  protected submitMessage(): void {
    this.errorMessage.set(null);

    const nomeValue = this.nome().trim();
    const textoValue = this.texto().trim();

    // Validate name is not empty
    if (!nomeValue) {
      this.errorMessage.set('Por favor, digite seu nome completo.');
      return;
    }

    // Validate name has at least 2 words (first and last name)
    const nameParts = nomeValue.split(/\s+/).filter(part => part.length > 0);
    if (nameParts.length < 2) {
      this.errorMessage.set('Por favor, digite seu nome completo (nome e sobrenome).');
      return;
    }

    // Validate message is not empty
    if (!textoValue) {
      this.errorMessage.set('Por favor, escreva sua mensagem.');
      return;
    }

    this.submitting.set(true);

    const novaMensagem: NovaMensagemDTO = {
      nome: nomeValue,
      texto: textoValue
    };

    this.mensagemService.criarMensagem(novaMensagem).subscribe({
      next: () => {
        this.nome.set('');
        this.texto.set('');
        this.submitting.set(false);
        this.showSuccess.set(true);
        this.loadMensagens();

        setTimeout(() => {
          this.showSuccess.set(false);
        }, 3000);
      },
      error: (err: any) => {
        console.error('Erro ao enviar mensagem:', err);
        this.errorMessage.set('Erro ao enviar mensagem. Tente novamente.');
        this.submitting.set(false);
      }
    });
  }

  protected getFixedRotation(index: number): string {
    const rotations = ['-2deg', '-1deg', '0deg', '1deg', '2deg', '-3deg', '3deg', '-1.5deg', '1.5deg'];
    return rotations[index % rotations.length];
  }

  protected formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `há ${diffMins} min`;
    if (diffHours < 24) return `há ${diffHours}h`;
    if (diffDays < 7) return `há ${diffDays}d`;

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }
}

