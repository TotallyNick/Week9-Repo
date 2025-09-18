import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-add-product',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-products.html'
})
export class AddProductComponent {
  model: Product = { id: 0, name: '', description: '', price: 0, units: 0 };

  constructor(private api: ProductService, private router: Router) {}

  save(){
    this.api.add(this.model).subscribe({
      next: () => this.router.navigate(['/products'])
    });
  }
  back(){
    next: () => this.router.navigate(['/products'])
  }
}
