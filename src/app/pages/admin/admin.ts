import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConviteService } from '../../../service/convite.service';
import { ConviteDTO } from '../../../type/convite.DTO';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit {
  protected convites = signal<ConviteDTO[]>([]);
  protected loading = signal(true);
  protected copiedId = signal<number | null>(null);

  constructor(private conviteService: ConviteService) {}

  ngOnInit(): void {
    this.loadConvites();
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
      return convite.convidados.filter(c => c.statusPresenca === 'NEGADO').length;
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

  private translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'COMPARECERA': 'Confirmado',
      'NEGADO': 'Negado',
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
