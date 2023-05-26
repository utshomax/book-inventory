import React, { ChangeEvent, useState } from "react";
import { TextField, Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from "@material-ui/core";
import { Book } from "../types/books";

interface BookFormProps {
  book?: Book;
  onSubmit: (book: Book) => void;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSubmit }) => {
  //console.log(book);
  const getDefaultFormData = (): Book => ({
    _id: "",
    name: "",
    image: "",
    category: "",
    code: 0,
    description: "",
    price: {
      price: 0,
      tax: 0,
      discount: 0,
    },
    stock: {
      unit: "",
      quantity: 0,
      date: "",
      enableLowStockAlert: true,
      lowStockAlertQuantity: 0,
    },
  });
  enum ECategorys{
    FANTASY = "fantasy",
    SCIENCE_FICTION = "science_fiction",
    ROMANCE = "romance",
    MYSTERY = "mystery",
  }

  enum EUnits{
      PIECE = "piece",
      BOX = "box",
  }
  const [formData, setFormData] = useState<Book>(book || getDefaultFormData());

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value, checked} = event.target;
    let updatebool = false
    const nameParts = name?.split(".");
    if (nameParts && nameParts.length === 2) {
      const [nestedProperty, subProperty] = nameParts;
      if(nestedProperty === "stock" && subProperty === "enableLowStockAlert"){
        updatebool = true
      }
      setFormData((prevFormData) => ({
        ...prevFormData,
        [nestedProperty]: {
          ...prevFormData[nestedProperty as keyof Book] as Object,
          [subProperty]: updatebool ? checked : !isNaN(Number(value)) ? Number(value) : value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name as string]: value,
      }));
    }
    console.log(formData);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formData);
  };


  return (
      <form  onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6">Book Details</Typography>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              fullWidth
            />
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="category"
              value={formData.category}
              onChange={e => handleChange(e as ChangeEvent<HTMLInputElement>)}
              fullWidth
            >
              {
                Object.values(ECategorys).map((category) => (<MenuItem key={category} value={category}>{category.toUpperCase()}</MenuItem>))
                }
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Price and Stock Info</Typography>
            <TextField
              label="Code"
              name="code"
              type="number"
              value={formData.code}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Price"
              name="price.price"
              type="number"
              value={formData.price.price}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Tax"
              name="price.tax"
              type="number"
              value={formData.price.tax}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Stock"
              name="stock.quantity"
              type="number"
              value={formData.stock.quantity}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Low Stock Alert On"
              name="stock.lowStockAlertQuantity"
              type="number"
              value={formData.stock.lowStockAlertQuantity}
              onChange={handleChange}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch checked={formData.stock.enableLowStockAlert } 
                onChange={handleChange} 
                name="stock.enableLowStockAlert" />
              }
              label="Enable Low Stock Alert"
              labelPlacement="start"
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    );
};

export default BookForm;
