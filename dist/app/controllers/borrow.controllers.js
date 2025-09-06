"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_models_1 = require("../models/book.models");
const borrow_models_1 = require("../models/borrow.models");
exports.borrowRoutes = express_1.default.Router();
exports.borrowRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { book: bookId, quantity, dueDate } = req.body;
    try {
        const targetedBook = yield book_models_1.Book.findById(bookId);
        if (targetedBook && targetedBook.copies >= quantity) {
            const newBook = new book_models_1.Book(targetedBook);
            const afterUpdatedCopies = yield newBook.updateBook(quantity, "decrease");
            if (afterUpdatedCopies.copies === 0) {
                const bookMethod = yield newBook.updateAvailable(false);
            }
            const createBorrow = yield borrow_models_1.Borrow.create(req.body);
            res.json({
                success: true,
                message: "Book borrowed successfully",
                data: createBorrow,
            });
        }
        else if (targetedBook && targetedBook.copies < quantity) {
            res.json({
                success: false,
                message: "That many copies are not available",
                data: null,
            });
        }
        else {
            res.json({
                success: false,
                message: "Book not found",
                data: null,
            });
        }
    }
    catch (error) {
        res.json({
            message: "Borrowing book unsuccessful",
            success: false,
            error: {
                name: error.name,
                errors: error,
            },
        });
    }
}));
exports.borrowRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield borrow_models_1.Borrow.aggregate([
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
    }
    catch (error) {
        res.json({
            message: "Borrows retrieving failed",
            success: false,
            error: {
                name: error.name,
                errors: error.errors,
            },
        });
    }
}));
