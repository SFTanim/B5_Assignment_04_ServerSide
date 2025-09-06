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
exports.bookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_models_1 = require("../models/book.models");
exports.bookRoutes = express_1.default.Router();
// Create a Book
exports.bookRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBookData = req.body;
        const newBook = yield book_models_1.Book.create(newBookData);
        return res.json({
            success: true,
            message: "Book created successfully",
            data: newBook,
        });
    }
    catch (error) {
        return res.json({
            message: "Books creating failed",
            success: false,
            error: {
                name: error.name,
                errors: error.errors,
            },
        });
    }
}));
// Get All Books
exports.bookRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filter, sortBy, sort = "asc", limit = "10" } = req.query;
    try {
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        let sortOptions = {};
        if (sortBy) {
            const sortOrder = sort === "desc" ? -1 : 1;
            sortOptions = { [sortBy.toString()]: sortOrder };
        }
        const books = yield book_models_1.Book.find(query).sort(sortOptions);
        res.json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        res.json({
            message: "Books retrieving failed",
            success: false,
            error: {
                name: error.name,
                errors: error.errors,
            },
        });
    }
}));
// Get Signle Book
exports.bookRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    try {
        const book = yield book_models_1.Book.findById(bookId);
        if (!book) {
            res.json({
                success: false,
                message: "Book not found",
                data: null,
            });
        }
        else {
            res.json({
                success: true,
                message: "Books retrieved successfully",
                data: book,
            });
        }
    }
    catch (error) {
        res.json({
            message: "Books retrieving failed",
            success: false,
            error: {
                name: error.name,
                errors: error,
            },
        });
    }
}));
// Update Single Book By ID
exports.bookRoutes.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    try {
        const book = yield book_models_1.Book.findById(bookId);
        const newTotalCopies = parseInt(req.body.copies);
        const newBook = new book_models_1.Book(book);
        yield newBook.updateBook(req.body, "wholeData");
        if (newTotalCopies > 0) {
            yield newBook.updateBook(newTotalCopies, "set");
            const updatedBook = yield newBook.updateAvailable(true);
            res.json({
                success: true,
                message: "Book updated successfully",
                data: updatedBook,
            });
        }
        else if (newTotalCopies === 0) {
            yield newBook.updateBook(newTotalCopies, "set");
            const updatedBook = yield newBook.updateAvailable(false);
            res.json({
                success: true,
                message: "Book updated successfully",
                data: updatedBook,
            });
        }
        else {
            res.json({
                success: false,
                message: "Please input a positive number",
                data: book,
            });
        }
    }
    catch (error) {
        res.json({
            message: "Books updating failed",
            success: false,
            error: {
                name: error.name,
                errors: error,
            },
        });
    }
}));
// Delete Single Book By ID
exports.bookRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    try {
        const book = yield book_models_1.Book.findById(bookId);
        if (book) {
            yield book_models_1.Book.findOneAndDelete({ _id: bookId });
            const book = yield book_models_1.Book.findById(bookId);
            res.json({
                success: true,
                message: "Book deleted successfully",
                data: book,
            });
        }
        else {
            res.json({
                success: true,
                message: "Book not found and delete unsuccessful",
                data: book,
            });
        }
    }
    catch (error) {
        res.json({
            message: "Books deleting failed",
            success: false,
            error: {
                name: error.name,
                errors: error,
            },
        });
    }
}));
