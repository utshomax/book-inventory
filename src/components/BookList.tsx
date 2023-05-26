import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import BookForm from "./BookForm";
import { Book } from "../types/books";
import WarningIcon from '@mui/icons-material/Warning';
import TablePagination from '@mui/material/TablePagination';
import TableFooter from "@mui/material/TableFooter";

const useStyles = makeStyles({
  ellipsis: {
    maxWidth: 200, // percentage also works
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleItemRight: {
    color: "white",
    backgroundColor: "blue",
    top: "50%",
    height: 30,
    float: "right",
    position: "relative",
    transform: "translateY(-50%)"
  }
});

interface TablePaginationActionsProps {
  count: number;
  page: number;
  booksPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}


const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = React.useState(0);
  const [booksPerPage, setRowsPerPage] = React.useState(5);

  const classes = useStyles();

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/book");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };
  
  useEffect(() => {
    fetchBooks();
  }, []);

  const handleRowClick = (book: Book) => {
    setSelectedBook(book);
    setOpenModal(true);
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * booksPerPage - books.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFormSubmit = (book: Book) => {
    // Logic to update the book
    if(book._id == "" || book._id == null || !book._id){
      addBookToServer(book);
      fetchBooks();
      return
    }
    console.log("Updated book:", book);
    updateBookToServer(book);

    setBooks((prevBooks) => {
      return prevBooks.map((prevBook) => {
        if (prevBook._id === book._id) {
          return book;
        }
        return prevBook;
      });
    });
    //setOpenModal(false);
  };

  const updateBookToServer = async (book: Book) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/book/${book._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(book),
        }
      );
      const data = await response.json();
      console.log("Updated book:", data);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };


  const addBookToServer = async (book: Book) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(book),
        }
      );
      const data = await response.json();
      console.log("Added book:", data);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        <span> <br></br> BOOK INVENTORY</span>
      </Typography>
      <Button
        variant="contained"
        color="primary"
        className={classes.titleItemRight}
        onClick={handleAddBook}
        style={{ marginBottom: 10 }}
      >
        Add Book
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Cover</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(booksPerPage > 0 ? books.slice(page * booksPerPage, page * booksPerPage + booksPerPage)
            : books
          ).map((book : any,index :any) => (
              <TableRow
                key={book._id}
                hover
                onClick={() => handleRowClick(book)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{index+1}</TableCell>
                <TableCell>
                  <img
                    src={book.image}
                    alt={book.name}
                    style={{ height: 35,width: 30 }}
                  />
                </TableCell>
                <TableCell>{book.name}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>{book.code}</TableCell>
                <TableCell><Typography className={classes.ellipsis}>
                    {book.description}
                </Typography></TableCell>
                <TableCell>{book.price.price}</TableCell>
                <TableCell><>{ (book.stock.enableLowStockAlert && book.stock.quantity < book.stock.lowStockAlertQuantity) ? (
                        <Typography>{book.stock.quantity}<WarningIcon fontSize="small" sx={{height:14}} color="error" /></Typography>):
                        (<Typography>{book.stock.quantity}</Typography>)
                      }
                        </>
                  </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
          </TableBody>
          <TableFooter>
          <TableRow>
          <TableCell colSpan={8}>
          <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={8}
              count={books.length}
              rowsPerPage={booksPerPage}
              align="center"
              page={page}
              component={TableContainer}
              SelectProps={{
                inputProps: {
                  'aria-label': 'books per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </TableCell>
            </TableRow>
        </TableFooter>
        </Table>
      </TableContainer>
  
      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Edit Book</DialogTitle>
        <DialogContent>
          {selectedBook ? (
            <BookForm book={selectedBook} onSubmit={handleFormSubmit} />
          ): 
          (<BookForm onSubmit={handleFormSubmit} />)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookList;
