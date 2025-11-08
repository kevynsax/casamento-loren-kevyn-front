import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  imports: [CommonModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss'
})
export class Portfolio {
  protected images = Array.from({ length: 7 }, (_, i) => ({
    id: i + 1,
    src: `assets/images/portfolio/${i + 1}.jpg`,
    alt: `Foto ${i + 1}`
  }));

  protected selectedImageIndex = signal<number | null>(null);

  protected openLightbox(index: number): void {
    this.selectedImageIndex.set(index);
    document.body.style.overflow = 'hidden';
  }

  protected closeLightbox(): void {
    this.selectedImageIndex.set(null);
    document.body.style.overflow = '';
  }

  protected nextImage(): void {
    const current = this.selectedImageIndex();
    if (current !== null && current < this.images.length - 1) {
      this.selectedImageIndex.set(current + 1);
    }
  }

  protected previousImage(): void {
    const current = this.selectedImageIndex();
    if (current !== null && current > 0) {
      this.selectedImageIndex.set(current - 1);
    }
  }

  @HostListener('document:keydown', ['$event'])
  protected handleKeydown(event: KeyboardEvent): void {
    if (this.selectedImageIndex() === null) return;

    switch (event.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
      case 'ArrowLeft':
        this.previousImage();
        break;
    }
  }
}
