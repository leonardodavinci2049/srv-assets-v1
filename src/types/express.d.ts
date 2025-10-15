// Ensure Express Multer types are properly recognized
/// <reference types="multer" />

declare namespace Express {
  export interface Request {
    file?: Multer.File;
    files?:
      | {
          [fieldname: string]: Multer.File[];
        }
      | Multer.File[];
  }
}
