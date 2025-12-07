import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateObjectId = (paramName: string = "id") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_ID",
          message: `Invalid ${paramName} format`,
        },
      });
      return;
    }
    next();
  };
};
