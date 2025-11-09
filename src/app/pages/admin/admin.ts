import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConviteService } from '../../../service/convite.service';
import { ConviteDTO } from '../../../type/convite.DTO';
import { CompraService } from '../../../service/compra.service';
import { Compra } from '../../../type/NovaIntencaoCompra.DTO';
import { MensagemService } from '../../../service/mensagem.service';
import { MensagemDTO } from '../../../type/Mensagem.DTO';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit, OnDestroy {
  protected convites = signal<ConviteDTO[]>([]);
  protected compras = signal<Compra[]>([]);
  protected mensagens = signal<MensagemDTO[]>([]);
  protected loading = signal(true);
  protected loadingCompras = signal(true);
  protected loadingMensagens = signal(true);
  protected copiedId = signal<number | null>(null);
  protected activeTab = signal<'rsvp' | 'purchases' | 'messages'>('rsvp');
  private mensagensInterval?: any;

  constructor(
    private conviteService: ConviteService,
    private compraService: CompraService,
    private mensagemService: MensagemService
  ) {}

  ngOnInit(): void {
    this.loadConvites();
    this.loadCompras();
    this.loadMensagens();
    this.startMensagensPolling();
  }

  ngOnDestroy(): void {
    this.stopMensagensPolling();
  }

  private loadConvites(): void {
    this.conviteService.listarConvites().subscribe({
      next: (convites) => {
        this.convites.set(convites);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar convites:', err);
        this.loading.set(false);
      }
    });
  }

  private loadCompras(): void {
    this.compraService.listarCompras().subscribe({
      next: (compras) => {
        this.compras.set(compras);
        this.loadingCompras.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar compras:', err);
        this.loadingCompras.set(false);
      }
    });
  }

  private loadMensagens(): void {
    this.mensagemService.listarMensagens().subscribe({
      next: (mensagens) => {
        this.mensagens.set(mensagens);
        this.loadingMensagens.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar mensagens:', err);
        this.loadingMensagens.set(false);
      }
    });
  }

  private startMensagensPolling(): void {
    this.mensagensInterval = setInterval(() => {
      this.loadMensagens();
    }, 5000);
  }

  private stopMensagensPolling(): void {
    if (this.mensagensInterval) {
      clearInterval(this.mensagensInterval);
      this.mensagensInterval = undefined;
    }
  }

  protected setActiveTab(tab: 'rsvp' | 'purchases' | 'messages'): void {
    this.activeTab.set(tab);
  }

  protected getInviteUrl(conviteId: number): string {
    return `${window.location.origin}/convite/${conviteId}`;
  }

  protected copyUrl(conviteId: number): void {
    const url = this.getInviteUrl(conviteId);
    navigator.clipboard.writeText(url).then(() => {
      this.copiedId.set(conviteId);
      setTimeout(() => {
        this.copiedId.set(null);
      }, 2000);
    });
  }

  protected getConfirmedCount(convite: ConviteDTO): number {
    return convite.convidados.filter(c => c.statusPresenca === 'COMPARECERA').length;
  }

  protected getDeclinedCount(convite: ConviteDTO): number {
    if (convite.respondido) {
      return convite.convidados.filter(c => c.statusPresenca !== 'COMPARECERA').length;
    } else {
      return convite.convidados.filter(c => c.statusPresenca === 'FALTARA').length;
    }
  }

  protected getNoResponseCount(convite: ConviteDTO): number {
    if (convite.respondido) {
      return 0;
    } else {
      return convite.convidados.filter(c => c.statusPresenca === 'SEMRESPOSTA').length;
    }
  }

  protected getTotalStats() {
    const convites = this.convites();
    const allGuests = convites.flatMap(c => c.convidados);

    const total = allGuests.length;
    const totalAdults = allGuests.filter(g => !g.crianca).length;
    const totalChildren = allGuests.filter(g => g.crianca).length;

    const confirmed = allGuests.filter(g => g.statusPresenca === 'COMPARECERA').length;
    const confirmedAdults = allGuests.filter(g => g.statusPresenca === 'COMPARECERA' && !g.crianca).length;
    const confirmedChildren = allGuests.filter(g => g.statusPresenca === 'COMPARECERA' && g.crianca).length;

    const declined = convites.reduce((sum, c) => sum + this.getDeclinedCount(c), 0);
    const noResponse = convites.reduce((sum, c) => sum + this.getNoResponseCount(c), 0);

    return {
      total,
      totalAdults,
      totalChildren,
      confirmed,
      confirmedAdults,
      confirmedChildren,
      declined,
      noResponse
    };
  }

  protected exportToCSV(): void {
    const convites = this.convites();

    // UTF-8 BOM for better Excel/Numbers compatibility
    const BOM = '\uFEFF';

    // CSV header
    const csvLines: string[] = [];
    csvLines.push('ID Convite;Nome Convite;Respondido;ID Convidado;Nome Convidado;Status Presenca;Crianca;Link Convite');

    // CSV data
    convites.forEach(convite => {
      const baseUrl = `${window.location.origin}/convite/${convite.id}`;
      const respondido = convite.respondido ? 'Sim' : 'Nao';

      if (convite.convidados.length === 0) {
        // If no guests, add one row for the invite
        csvLines.push(`${convite.id};"${convite.nomeConvite}";${respondido};;;;"${baseUrl}"`);
      } else {
        // Add a row for each guest
        convite.convidados.forEach(convidado => {
          const statusPresenca = this.translateStatus(convidado.statusPresenca);
          const crianca = convidado.crianca ? 'Sim' : 'Nao';
          const nomeConvidado = convidado.nome.replace(/"/g, '""'); // Escape quotes
          csvLines.push(`${convite.id};"${convite.nomeConvite}";${respondido};${convidado.id};"${nomeConvidado}";"${statusPresenca}";${crianca};"${baseUrl}"`);
        });
      }
    });

    // Join lines with proper line breaks
    const csv = BOM + csvLines.join('\r\n');

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `convites_rsvp_${this.getFormattedDate()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);
  }

  protected getPurchaseStats() {
    const compras = this.compras();
    const total = compras.length;
    const totalValue = compras.reduce((sum, c) => sum + c.total, 0);
    const finalized = compras.filter(c => c.statusPagamento === 'FINALIZADO').length;
    const pending = compras.filter(c => c.statusPagamento === 'PENDENTE').length;
    const pix = compras.filter(c => c.tipoPagamento === 'PIX').length;
    const cartao = compras.filter(c => c.tipoPagamento === 'CARTAO').length;

    return {
      total,
      totalValue,
      finalized,
      pending,
      pix,
      cartao
    };
  }

  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  protected formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  protected getRandomRotation(): string {
    const rotations = ['-2deg', '-1deg', '0deg', '1deg', '2deg', '-3deg', '3deg'];
    return rotations[Math.floor(Math.random() * rotations.length)];
  }

  private translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'COMPARECERA': 'Confirmado',
      'FALTARA': 'Faltará',
      'SEMRESPOSTA': 'Sem Resposta'
    };
    return statusMap[status] || status;
  }

  private getFormattedDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}`;
  }
}
