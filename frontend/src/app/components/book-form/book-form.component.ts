import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import {Book} from "../../models/book";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss'],
  providers: [DatePipe]
})
export class BookFormComponent implements OnInit {

  genres: string[] = ['Fiction narrative', 'Narrative nonfiction', 'Metafiction', 'Classic', 'Tall tale',
    'Mystery', 'Science fiction', 'Fanfiction', 'Essay', 'Comic/Graphic Novel', 'Fiction in verse',
    'Historical fiction', 'Fable', 'Realistic fiction', 'Folklore', 'Short story', 'Crime/Detective',
    'Fairy tale', 'Reference book', 'Textbook', 'Horror', 'Speech', 'Suspense/Thriller', 'Humor',
    'Biography/Autobiography', 'Legend', 'Mythopoeia', 'Western', 'Mythology', 'Fantasy', 'Other'];
  book: Book;
  year: number;

  constructor(private bookService: BookService, private datePipe: DatePipe) {
    this.book = {id: 'fc80bbda-18f8-4695-af8f-6044dbbe9ce8', title: '', author: '', genre: '', year: null, added: null,
      checkOutCount: 0, dueDate: null, status: 'AVAILABLE', comment: null};
  }

  ngOnInit(): void {
    this.book.added = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.year = new Date().getFullYear();
  }

  isBookValid(): boolean {
    if (!this.book.title || !this.book.author || !this.book.genre || !this.book.year) {
      return false
    }
    return true
  }

  saveBook(): void {
    this.bookService.saveBook(this.book).subscribe()
    window.location.href = '/books'
  }

}
