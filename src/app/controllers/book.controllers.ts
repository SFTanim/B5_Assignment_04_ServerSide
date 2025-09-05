import express, { Request, Response } from "express";
import { Book } from "../models/book.models";

export const bookRoutes = express.Router();

// Create a Book
bookRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const newBookData = req.body;
    console.log("post body", newBookData);
    const newBook = await Book.create(newBookData);
    console.log(newBook);
    return res.json({
      success: true,
      message: "Book created successfully",
      data: newBook,
    });
  } catch (error: any) {
    return res.send(console.log(error));
  }
});

// Get All Books
bookRoutes.get("/", async (req: Request, res: Response) => {
  const { filter, sortBy, sort = "asc", limit = "10" } = req.query;
  try {
    const query: any = {};
    if (filter) {
      query.genre = filter;
    }

    let sortOptions = {};
    if (sortBy) {
      const sortOrder = sort === "desc" ? -1 : 1;
      sortOptions = { [sortBy.toString()]: sortOrder };
    }

    const books = await Book.find(query).sort(sortOptions);

    res.json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error: any) {
    res.json({
      message: "Books retrieving failed",
      success: false,
      error: {
        name: error.name,
        errors: error.errors,
      },
    });
  }
});

// Get Signle Book
bookRoutes.get("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      res.json({
        success: false,
        message: "Book not found",
        data: null,
      });
    } else {
      res.json({
        success: true,
        message: "Books retrieved successfully",
        data: book,
      });
    }
  } catch (error: any) {
    res.json({
      message: "Books retrieving failed",
      success: false,
      error: {
        name: error.name,
        errors: error,
      },
    });
  }
});

// Update Single Book By ID
bookRoutes.put("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  try {
    const book = await Book.findById(bookId);
    const newTotalCopies = parseInt(req.body.copies);
    const newBook = new Book(book);
    await newBook.updateBook(req.body, "wholeData");

    if (newTotalCopies > 0) {
      await newBook.updateBook(newTotalCopies, "set");
      const updatedBook = await newBook.updateAvailable(true);

      res.json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook,
      });
    } else if (newTotalCopies === 0) {
      await newBook.updateBook(newTotalCopies, "set");
      const updatedBook = await newBook.updateAvailable(false);
      res.json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook,
      });
    } else {
      res.json({
        success: false,
        message: "Please input a positive number",
        data: book,
      });
    }
  } catch (error: any) {
    res.json({
      message: "Books updating failed",
      success: false,
      error: {
        name: error.name,
        errors: error,
      },
    });
  }
});

// Delete Single Book By ID
bookRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  try {
    const book = await Book.findById(bookId);
    if (book) {
      await Book.findOneAndDelete({ _id: bookId });
      const book = await Book.findById(bookId);
      res.json({
        success: true,
        message: "Book deleted successfully",
        data: book,
      });
    } else {
      res.json({
        success: true,
        message: "Book not found and delete unsuccessful",
        data: book,
      });
    }
  } catch (error: any) {
    res.json({
      message: "Books deleting failed",
      success: false,
      error: {
        name: error.name,
        errors: error,
      },
    });
  }
});
