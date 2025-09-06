"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controllers_1 = require("./app/controllers/book.controllers");
const borrow_controllers_1 = require("./app/controllers/borrow.controllers");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "https://assignment-4front-end.vercel.app" }));
app.use(express_1.default.json());
app.use("/books", book_controllers_1.bookRoutes);
app.use("/borrow", borrow_controllers_1.borrowRoutes);
app.use("/", (req, res) => {
    res.send("Assignment-004 : Minimal Library Management System");
});
exports.default = app;
