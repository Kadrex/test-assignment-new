import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { BooksListComponent } from './components/books-list/books-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { CheckoutsListComponent } from "./components/checkouts-list/checkouts-list.component";
import {CheckoutDetailComponent} from "./components/checkout-detail/checkout-detail.component";
import {BookFormComponent} from "./components/book-form/book-form.component";
import {FormsModule} from "@angular/forms";
import {ConfirmationDialog} from "./components/confirmation-dialog/confirmation-dialog.component";
import {CheckoutFormComponent} from "./components/checkout-form/checkout-form.component";
import {FavoritesListComponent} from "./components/favorites-list/favorites-list.component";
import {LateCheckoutsListComponent} from "./components/late-checkouts-list/late-checkouts-list.component";


@NgModule({
  declarations: [
    AppComponent,
    BooksListComponent,
    BookDetailComponent,
    CheckoutsListComponent,
    CheckoutDetailComponent,
    BookFormComponent,
    ConfirmationDialog,
    CheckoutFormComponent,
    FavoritesListComponent,
    LateCheckoutsListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
