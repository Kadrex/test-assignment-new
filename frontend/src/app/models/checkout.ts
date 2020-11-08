export interface Checkout {
  id: string;
  borrower_first_name: string;
  borrower_last_name: string;
  book_id: string;
  checked_out_date: string;
  due_date: string;
}
