import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksListComponent } from './components/books-list/books-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import {CheckoutsListComponent} from "./components/checkouts-list/checkouts-list.component";
import {CheckoutDetailComponent} from "./components/checkout-detail/checkout-detail.component";
import {BookFormComponent} from "./components/book-form/book-form.component";
import {CheckoutFormComponent} from "./components/checkout-form/checkout-form.component";

const routes: Routes = [
  {path: '', redirectTo: 'books', pathMatch: 'full'},
  {path: 'books', component: BooksListComponent},
  {path: 'books/:id', component: BookDetailComponent},
  {path: 'checkouts', component: CheckoutsListComponent},
  {path: 'checkouts/:id', component: CheckoutDetailComponent},
  {path: 'book-form/new', component: BookFormComponent},
  {path: 'book-form/edit/:id', component: BookFormComponent},
  {path: 'checkout-form/new/:id', component: CheckoutFormComponent},
  {path: 'checkout-form/:id', component: CheckoutFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
