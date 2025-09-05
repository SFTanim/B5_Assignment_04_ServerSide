import { Document } from "mongoose";


export interface IBook extends Document {
  title: string;
  author: string;
  genre:
    | "FICTION"
    | "NON_FICTION"
    | "SCIENCE"
    | "HISTORY"
    | "BIOGRAPHY"
    | "FANTASY";
  isbn: string;
  description: string;
  copies: number;
  available: boolean;
  updateBook(value: number, value2: string): Promise<IBook>;
  updateAvailable(availability: boolean): Promise<IBook>;
}

export interface BookInstanceMethods {
  updateAvailable(value: boolean): boolean;
  updateBook(value: number, value2: string): number;
}
