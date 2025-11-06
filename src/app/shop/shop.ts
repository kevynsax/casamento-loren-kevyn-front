import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentModal } from './payment-modal/payment-modal';

interface Product {
  id: number;
  name: string;
  image: string;
  originalPrice: number;
  salePrice: number;
  animationDuration: string;
}

@Component({
  selector: 'app-shop',
  imports: [CommonModule, PaymentModal],
  templateUrl: './shop.html',
  styleUrl: './shop.scss'
})
export class Shop {
  protected selectedProduct = signal<Product | null>(null);
  protected isModalOpen = signal(false);
  protected products: Product[] = [
    {
      id: 1,
      name: 'Designer Gown',
      image: 'assets/images/product/1.jpg',
      originalPrice: 912.00,
      salePrice: 800.00,
      animationDuration: '1000ms'
    },
    {
      id: 2,
      name: 'Wedding Rings',
      image: 'assets/images/product/2.jpg',
      originalPrice: 800.00,
      salePrice: 750.00,
      animationDuration: '1200ms'
    },
    {
      id: 3,
      name: 'Earrings',
      image: 'assets/images/product/3.jpg',
      originalPrice: 150.00,
      salePrice: 100.00,
      animationDuration: '1400ms'
    },
    {
      id: 4,
      name: 'Wedding Shoe',
      image: 'assets/images/product/4.jpg',
      originalPrice: 360.00,
      salePrice: 320.00,
      animationDuration: '1600ms'
    },
    {
      id: 5,
      name: 'Mixed Rose Bouquet',
      image: 'assets/images/product/5.jpg',
      originalPrice: 912.00,
      salePrice: 800.00,
      animationDuration: '1000ms'
    },
    {
      id: 6,
      name: 'Special White Bouquet',
      image: 'assets/images/product/6.jpg',
      originalPrice: 800.00,
      salePrice: 750.00,
      animationDuration: '1200ms'
    },
    {
      id: 7,
      name: 'Classic Mixed Bouquet',
      image: 'assets/images/product/7.jpg',
      originalPrice: 150.00,
      salePrice: 100.00,
      animationDuration: '1400ms'
    },
    {
      id: 8,
      name: 'White Roses',
      image: 'assets/images/product/8.jpg',
      originalPrice: 360.00,
      salePrice: 320.00,
      animationDuration: '1600ms'
    },
    {
      id: 9,
      name: 'Unique White Bouquet',
      image: 'assets/images/product/9.jpg',
      originalPrice: 912.00,
      salePrice: 800.00,
      animationDuration: '1000ms'
    },
    {
      id: 10,
      name: 'Special Bouquet',
      image: 'assets/images/product/10.jpg',
      originalPrice: 800.00,
      salePrice: 750.00,
      animationDuration: '1200ms'
    },
    {
      id: 11,
      name: 'White Roses',
      image: 'assets/images/product/11.jpg',
      originalPrice: 150.00,
      salePrice: 100.00,
      animationDuration: '1400ms'
    },
    {
      id: 12,
      name: 'Flower With Leaf',
      image: 'assets/images/product/12.jpg',
      originalPrice: 360.00,
      salePrice: 320.00,
      animationDuration: '1600ms'
    }
  ];


  protected openPaymentModal(product: Product): void {
    this.selectedProduct.set(product);
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  protected closePaymentModal(): void {
    this.isModalOpen.set(false);
    document.body.style.overflow = '';
    setTimeout(() => {
      this.selectedProduct.set(null);
    }, 300);
  }
  protected formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}
