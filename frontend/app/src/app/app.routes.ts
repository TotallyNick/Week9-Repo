import { Routes } from '@angular/router';
import { Products } from './pages/products/products';
import { AddProductComponent } from './pages/add-products/add-products';
import { UpdateProductComponent } from './pages/update-products/update-products';

export const routes: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', component: Products },
    { path: 'add', component: AddProductComponent },
    { path: 'update/:id', component: UpdateProductComponent },
];
