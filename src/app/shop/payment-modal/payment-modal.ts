import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  image: string;
  originalPrice: number;
  salePrice: number;
  animationDuration: string;
}

type PaymentMethod = 'pix' | 'credit-card';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-modal.html',
  styleUrl: './payment-modal.scss'
})
export class PaymentModal {
  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  protected selectedPaymentMethod = signal<PaymentMethod>('pix');
  protected isProcessing = signal(false);
  protected paymentSuccess = signal(false);

  // Credit Card form
  protected cardNumber = '';
  protected cardName = '';
  protected cardExpiry = '';
  protected cardCvv = '';

  // Pix
  protected pixKey = '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000';
  protected pixCopied = signal(false);

  protected selectPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod.set(method);
  }

  protected closeModal(): void {
    this.resetForm();
    this.close.emit();
  }

  protected copyPixKey(): void {
    navigator.clipboard.writeText(this.pixKey).then(() => {
      this.pixCopied.set(true);
      setTimeout(() => this.pixCopied.set(false), 2000);
    });
  }

  protected processPayment(): void {
    this.isProcessing.set(true);

    // Simulate payment processing
    setTimeout(() => {
      this.isProcessing.set(false);
      this.paymentSuccess.set(true);

      setTimeout(() => {
        this.closeModal();
      }, 2000);
    }, 2000);
  }

  protected formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s/g, '');
    let formattedValue = '';

    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }

    this.cardNumber = formattedValue;
  }

  protected formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }

    this.cardExpiry = value;
  }

  private resetForm(): void {
    this.cardNumber = '';
    this.cardName = '';
    this.cardExpiry = '';
    this.cardCvv = '';
    this.paymentSuccess.set(false);
    this.pixCopied.set(false);
  }

  protected isFormValid(): boolean {
    if (this.selectedPaymentMethod() === 'credit-card') {
      return this.cardNumber.replace(/\s/g, '').length === 16 &&
             this.cardName.trim().length > 0 &&
             this.cardExpiry.length === 5 &&
             this.cardCvv.length === 3;
    }
    return true; // Pix doesn't require form validation
  }
}

