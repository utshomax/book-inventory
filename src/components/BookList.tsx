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
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from "@mui/material/Snackbar";

const HOST = 'https://book-inv-be.onrender.com' // 'http://localhost:5000' //

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


const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = React.useState(0);
  const [booksPerPage, setRowsPerPage] = React.useState(5);
  const [checked, setChecked] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [snackmessage, setMessage] = React.useState("");
  const classes = useStyles();

  const fetchBooks = async (withFilter = false) => {
    try {
      handleSnack("Loading books...");
      const response = await fetch(HOST + "/api/book" + (withFilter ? "?sortByLowStockAlert=true" : ""));
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };
  const handleSnack = (message:string) => {
    setMessage(message)
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
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
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.checked){
      setChecked(true);
      fetchBooks(true);
    }else{
      setChecked(false);
      fetchBooks();
    }
  }
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
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  const handleFormSubmit = (book: Book) => {
    // Logic to update the book
    if(book._id == "" || book._id == null || !book._id){
      addBookToServer(book);
      fetchBooks();
      handleModalClose()
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
    setOpenModal(false);
  };

  const updateBookToServer = async (book: Book) => {
    try {
      handleSnack("Updating book: " + book.name);
      const response = await fetch(
        HOST + `/api/book/${book._id}`,
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
      handleSnack("Error updating book: " + book.name);
      console.error("Error updating book:", error);
    }
  };

  const deleteBook = async (book: Book) => {
    try {
      const response = await fetch(
        HOST + `/api/book/${book._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      handleSnack("Deleted book: " + book.name);
      console.log("Deleted book:", data);
      fetchBooks();
    } catch (error) {
      handleSnack("Error deleting book: " + book.name);
      console.error("Error deleting book:", error);
    }
  };


  const addBookToServer = async (book: Book) => {
    try {
      handleSnack("Adding book: " + book.name);
      const response = await fetch(
        HOST + `/api/book`,
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
      handleSnack("Error adding book: " + book.name);
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
              <TableCell colSpan={8}>
              <FormControlLabel
                  value="end"
                  control={ <Switch
                    checked={checked}
                    onChange={handleFilterChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />}
                  label="Low Stock Alert"
                  labelPlacement="end"
                />
              </TableCell>
              </TableRow>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Cover</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
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
                <TableCell>
                  <IconButton
                    aria-label="edit"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRowClick(book);
                    }}
                  >
                    <EditIcon fontSize="small"/>
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteBook(book);
                    }}
                  >
                    <DeleteIcon fontSize="small"/>
                  </IconButton>
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
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={snackmessage}
        action={action}
        color="primary"
      />
    </Container>
  );
};

export default BookList;
