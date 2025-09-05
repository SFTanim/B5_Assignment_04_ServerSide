import express, { Request, Response } from "express";
import { Book } from "../models/book.models";
import { Borrow } from "../models/borrow.models";

export const borrowRoutes = express.Router();

borrowRoutes.post("/", async (req: Request, res: Response) => {
  const { book: bookId, quantity, dueDate } = req.body;
  try {
    const targetedBook = await Book.findById(bookId);
    if (targetedBook && targetedBook.copies >= quantity) {
      const newBook = new Book(targetedBook);
      const afterUpdatedCopies = await newBook.updateBook(quantity, "decrease");
      if (afterUpdatedCopies.copies === 0) {
        const bookMethod = await newBook.updateAvailable(false);
      }
      const createBorrow = await Borrow.create(req.body);
      res.json({
        success: true,
        message: "Book borrowed successfully",
        data: createBorrow,
      });
    } else if (targetedBook && targetedBook.copies < quantity) {
      res.json({
        success: false,
        message: "That many copies are not available",
        data: null,
      });
    } else {
      res.json({
        success: false,
        message: "Book not found",
        data: null,
      });
    }
  } catch (error: any) {
    res.json({
      message: "Borrowing book unsuccessful",
      success: false,
      error: {
        name: error.name,
        errors: error,
      },
    });
  }
});

borrowRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const books = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      {
        $project: { "book.title": 1, "book.isbn": 1, totalQuantity: 1, _id: 0 },
      },
    ]);

    res.json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: books,
    });
  } catch (error: any) {
    res.json({
      message: "Borrows retrieving failed",
      success: false,
      error: {
        name: error.name,
        errors: error.errors,
      },
    });
  }
});
