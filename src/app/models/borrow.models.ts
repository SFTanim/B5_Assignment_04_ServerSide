import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book id is missing"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is missing"],
      min: [0, "Quantity must be at least 1"],
    },
    dueDate: { type: Date, required: [true, "Due date is not submitted"] },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Borrow = model<IBorrow>("Borrow", borrowSchema);
