import express, { Application, Request, Response } from "express";
import { bookRoutes } from "./app/controllers/book.controllers";
import { borrowRoutes } from "./app/controllers/borrow.controllers";
import cors from "cors";

const app: Application = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/books", bookRoutes);
app.use("/borrow", borrowRoutes);

app.use("/", (req: Request, res: Response) => {
  res.send("Assignment-004 : Minimal Library Management System");
});

export default app;
