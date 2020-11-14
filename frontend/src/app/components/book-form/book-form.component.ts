import {Component, OnInit} from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from "../../models/book";
import { DatePipe } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import {BookStatus} from "../../models/book-status";

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss'],
  providers: [DatePipe]
})
export class BookFormComponent implements OnInit {

  private genres: string[] = ['Fiction narrative', 'Narrative nonfiction', 'Metafiction', 'Classic', 'Tall tale',
    'Mystery', 'Science fiction', 'Fanfiction', 'Essay', 'Comic/Graphic Novel', 'Fiction in verse',
    'Historical fiction', 'Fable', 'Realistic fiction', 'Folklore', 'Short story', 'Crime/Detective',
    'Fairy tale', 'Reference book', 'Textbook', 'Horror', 'Speech', 'Suspense/Thriller', 'Humor',
    'Biography/Autobiography', 'Legend', 'Mythopoeia', 'Western', 'Mythology', 'Fantasy', 'Other'];
  public selectedGenres: string[] = this.genres;
  public book: Book;
  public year: number;
  public bookIsLoaded: boolean = false;
  public pageTitle: string;
  private NEW_BOOK: string = 'New book';
  private EDIT_BOOK: string = 'Edit book';
  private statusProcessing: BookStatus = 'PROCESSING';


  constructor(
    private bookService: BookService,
    private datePipe: DatePipe,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(res => this.setBook(res));
  }

  setBook(res): void {
    if (res.id === undefined) {
      this.initializeNewBook();
      this.bookIsLoaded = true;
      this.pageTitle = this.NEW_BOOK;
    } else {
      this.bookService.getBook(res.id).subscribe(res => {
        this.book = res as Book;
        this.bookIsLoaded = true;
      })
      this.pageTitle = this.EDIT_BOOK
    }
  }

  initializeNewBook(): void {
    this.book = {id: null, title: '', author: '', genre: '', year: null, added: null,
      checkOutCount: 0, dueDate: null, status: this.statusProcessing, comment: null};
    this.book.added = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.year = new Date().getFullYear();
    this.book.id = this.generateId();
  }

  generateId(): string {
    let id = '';
    const chars = 'abcdef0123456789';
    const hyphenIndexes = [8, 13, 18, 23];
    for (let i = 0; i < 36; i++) {
      if (hyphenIndexes.indexOf(i) != -1) {
        id += '-';
      } else {
        id += chars[Math.floor(Math.random() * chars.length)]
      }
    }
    return id;
  }

  isBookValid(): boolean {
    return !(!this.book.title || !this.book.author || !this.book.genre || !this.book.year);
  }

  saveBook(): void {
    this.bookService.saveBook(this.book).subscribe()
  }

  saveBookAndView(): void {
    this.saveBook();
    window.location.href = '/books/' + this.book.id;
  }

  saveBookAndTable(): void {
    this.saveBook();
    window.location.href = '/books';
  }

  onKey(event): void {
    // https://stackoverflow.com/questions/48442794/implement-a-search-filter-for-the-mat-select-component-of-angular-material
    this.selectedGenres = this.search(event.target.value);
  }

  search(value: string): string[] {
    let filter = value.toLocaleLowerCase();
    return this.genres.filter(o => o.toLocaleLowerCase().startsWith(filter))
  }

}
