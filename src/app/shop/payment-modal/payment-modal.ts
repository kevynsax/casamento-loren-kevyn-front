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

  protected currentStep = signal<'info' | 'payment'>('info');
  protected selectedPaymentMethod = signal<PaymentMethod>('pix');
  protected isProcessing = signal(false);
  protected paymentSuccess = signal(false);

  // Guest Info
  protected guestName = '';
  protected guestMessage = '';

  // Credit Card form
  protected cardNumber = '';
  protected cardName = '';
  protected cardExpiry = '';
  protected cardCvv = '';
  protected cardCpf = '';

  // Pix
  protected pixKey = '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000';
  protected pixCopied = signal(false);

  protected selectPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod.set(method);
  }

  protected proceedToPayment(): void {
    if (this.isGuestInfoValid()) {
      this.currentStep.set('payment');
    }
  }

  protected isGuestInfoValid(): boolean {
    return this.guestName.trim().length > 0 && this.guestMessage.trim().length > 0;
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

  protected formatCpf(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    // Format: XXX.XXX.XXX-XX
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    if (value.length > 9) {
      value = value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6, 9) + '-' + value.slice(9);
    } else if (value.length > 6) {
      value = value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6);
    } else if (value.length > 3) {
      value = value.slice(0, 3) + '.' + value.slice(3);
    }

    this.cardCpf = value;
  }

  private resetForm(): void {
    this.currentStep.set('info');
    this.guestName = '';
    this.guestMessage = '';
    this.cardNumber = '';
    this.cardName = '';
    this.cardExpiry = '';
    this.cardCvv = '';
    this.cardCpf = '';
    this.paymentSuccess.set(false);
    this.pixCopied.set(false);
  }

  protected isFormValid(): boolean {
    if (this.selectedPaymentMethod() === 'credit-card') {
      return this.cardNumber.replace(/\s/g, '').length === 16 &&
             this.cardName.trim().length > 0 &&
             this.cardExpiry.length === 5 &&
             this.cardCvv.length === 3 &&
             this.cardCpf.replace(/\D/g, '').length === 11;
    }
    return true; // Pix doesn't require form validation
  }
}

