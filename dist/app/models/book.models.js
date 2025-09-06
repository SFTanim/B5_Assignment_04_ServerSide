"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const booksSchema = new mongoose_1.Schema({
    title: { type: String, required: [true, "Title is missing"] },
    author: { type: String, required: [true, "Author name is missing"] },
    genre: {
        type: String,
        enum: {
            values: [
                "FICTION",
                "NON_FICTION",
                "SCIENCE",
                "HISTORY",
                "BIOGRAPHY",
                "FANTASY",
            ],
            message: "Please select correct genre",
        },
        required: true,
    },
    isbn: {
        type: String,
        required: [true, "ISBN number is missing"],
        unique: [true, "Must be an unique number."],
    },
    description: { type: String },
    copies: {
        type: Number,
        required: [true, "Total copies is missing"],
        min: [0, "Copies must be a positive number"],
    },
    available: { type: Boolean, default: true },
}, {
    versionKey: false,
    timestamps: true,
});
// Methods
booksSchema.method("updateAvailable", function updateAvailable(newAvailable) {
    this.available = newAvailable;
    return this.save();
});
booksSchema.method("updateBook", function updateBook(value, command) {
    if (command === "decrease") {
        this.copies = this.copies - value;
        return this.save();
    }
    if (command === "increase") {
        this.copies = this.copies + value;
        return this.save();
    }
    if (command === "set") {
        this.copies = value;
        return this.save();
    }
    if (command === "wholeData") {
        this.title = value.title;
        this.author = value.author;
        this.genre = value.genre;
        this.isbn = value.isbn;
        this.description = value.description;
        return this.save();
    }
});
exports.Book = (0, mongoose_1.model)("Book", booksSchema);
